function createCookie(uid) {
    document.cookie = `user=${uid};`
    console.log(document.cookie)
}

function checkAuth() {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));
    if (userCookie) {
        return true
    }

    return false
}

function getUserId() {
    if (checkAuth()) {
        const userCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('user='));
        if (userCookie) {
            return userCookie.split('=')[1];
        }
    }
    return null;
}

export { createCookie, checkAuth, getUserId };
