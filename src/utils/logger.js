function logInfo(text, data) {
    if (data != null) {
        console.log(text + ": ", data);
    }
    else {
        console.log(text);
    }
}

export default logInfo