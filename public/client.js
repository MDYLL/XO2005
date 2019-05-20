// function get() {
//     alert("Get");
//     let a=50;
//     let url=`http://localhost:3003/?id=${a}`;
//     fetch(url)
//         .then((response) => {
//             alert(url);
//             return response.json();
//         })
//         .then((data) => {
//             let number = parseFloat(data);
//             alert(number);
//         })
//         .catch(() => {
//             alert("error");
//         })
// }
//
// function post() {
//
//     let score = parseFloat(document.getElementById('post').value);
//
//     fetch('http://localhost:3003/', {
//         method: 'POST',
//         headers: {
//             'Content-Type':"application/json; charset=utf-8"
//         },
//         body: JSON.stringify({
//             score:score
//         })
//     }).then(()=>{alert(score);})
// }
//
// export {
//     get,
// }