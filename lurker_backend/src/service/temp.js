
const FormData = require('form-data');
const axios = require('axios')

const myFunc = (dir, id) => {
    const bodyFormData = new FormData();

    // mc28ji
    // 1: Upvote
    // 0: Remove Upvote (if any)
    // -1: Downvote
    bodyFormData.append('dir', dir);
    bodyFormData.append('id', id);

    // const headers = {
    //     "Content-Type": "multipart/form-data",
    //     "Authorization": "Bearer 10902378528-72FcESwH-Rn-L9OXracaXAqtDHfkMg"
    // }

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer 10902378528-72FcESwH-Rn-L9OXracaXAqtDHfkMg"
    }

    axios.post('https://oauth.reddit.com/api/vote', {
        data: bodyFormData
    }, headers).then(res => {
        console.log('updooted!');
    }).catch(e => console.log(e));

    // axios({
    //     method: "post",
    //     url: "https://oauth.reddit.com/api/vote",
    //     data: bodyFormData,
    //     headers: headers,
    //   })
    //     .then(function (response) {
    //       //handle success
    //       console.log(response);
    //     })
    //     .catch(function (response) {
    //       //handle error
    //       console.log(response);
    //     });
    
    // axios({
    //     url: 'https://oauth.reddit.com/api/vote',
    //     headers: headers,
    //     data: `id=${id}&dir=${dir}`
    //   })
    //   .then(function(response) {
    //     console.log(response.data)
    //   })
    //   .catch(function(error) {
    //     console.log(error)
    //   })
}

myFunc('-1', 't3_mc28ji');