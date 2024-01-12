const {RtcTokenBuilder} = require('agora-access-token');

const generateAgoraToken = async (channelName) => {
    const appId = process.env.APP_ID;
    const appCertificate = process.env.APP_CERTIFICATE;
   const token = RtcTokenBuilder.buildTokenWithAccount(appId, appCertificate, channelName);
   return token
}

module.exports = generateAgoraToken;