const fetch = require('node-fetch').default;

// add role names to this object to map them to group ids in your AAD tenant
const roleGroupMappings = {
    'admin':'a86753b8-e17d-4d83-a57b-ce577629c481',
    'reader':'4dc6e90f-c776-4b5b-a32f-000969e6bda1'
};

module.exports = async function (context, req) {
    const user = req.body || {};
    const roles = [];
    
    for (const [role, groupId] of Object.entries(roleGroupMappings)) {
        if (await isUserInGroup(groupId, user.accessToken)) {        
            roles.push(role);
        }
    }
	user = getUser():

	if (user.claims.roles.indexOf('admin') > -1 ){
		roles.push("admin");
	}
	
/*
	if (req.user._json.groups.indexOf('a86753b8-e17d-4d83-a57b-ce577629c481') > -1) {
        //In Group
		roles.push("admin");
    } else {
        //Not in Group
    }
*/
	
	
    roles.push("testrolle");
	//context.log("The function has executed.");
    context.res.json({
        roles
    });
}

async function isUserInGroup(groupId, bearerToken) {
    const url = new URL('https://graph.microsoft.com/v1.0/me/memberOf');
    url.searchParams.append('$filter', `id eq '${groupId}'`);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`
        },
    });

    if (response.status !== 200) {
        return false;
    }

    const graphResponse = await response.json();
    const matchingGroups = graphResponse.value.filter(group => group.id === groupId);
    return matchingGroups.length > 0;
}


async function getUser() {
  //const response = await fetch('/api/user');
  const response = await fetch('/.auth/me');  
  const payload = await response.json();
  const { clientPrincipal } = payload;
  return clientPrincipal;
}
