export const getData = async (url) =>{
    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`Ошибка, статус ${response.status}`);
    }

    return await response.json();

}

export const sendData = async (url, data) =>{
    let token = ''
    let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      })
    // .then((res)=>res.json())
    // .then(res=>{console.log(res)})
    .catch(error => {
        console.error(error);
    });
    if(!response.ok){
        throw new Error(`Ошибка, статус ${response.status}`);
    }

    return await response.json();
}