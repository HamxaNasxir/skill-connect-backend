const generateChannelName = () => {
    const timeStamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);

    return `call-${timeStamp}-${randomSuffix}`
}

module.exports = generateChannelName