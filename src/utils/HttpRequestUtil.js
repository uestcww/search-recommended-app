/*
* http请求响应的相关工具函数，目前包括使用原版XMLHttpRequest做交互的和使用Fetch API两种
* 没有考虑引入jQuery使用ajax函数是因为，只为了使用一个函数就引入jQuery不太妥当，毕竟jQuery体量还是不小的
* */
require("es6-promise").polyfill();
require("isomorphic-fetch");
export function useXMLHttpRequest(headerObj, jsonObj, func){
    let jsonString = JSON.stringify(jsonObj);
    let xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let responseObj = JSON.parse(xmlhttp.responseText);
            func(responseObj);
        }
    };
    xmlhttp.open(headerObj.method,headerObj.url,true);
    xmlhttp.setRequestHeader("Content-Type","application/json");
    xmlhttp.send(jsonString);
}

export function fetchRequest(method, url, body){
    method = method.toUpperCase();
    if(method === "GET"){
        body = undefined;
    }else{
        body = body && JSON.stringify(body)
        console.log(body)
    }
    return fetch(url, {
        method,
        // mode: "cors" || "no-cors" || "其他",
        // cache: "no-cache" || "reload" || "force-cache" || "only-if-cached" || "其他",
        // credentials: "omit" || "include" || "same-origin" || "其他",
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        },
        // redirect: "follow" || "manual" || "error" || "其他",
        // referrer: "no-referrer" || "其他",
        body
    }).then( (res) => {
        if(res.status >= 200 && res.status < 300){
            return res;
        }else{
            return Promise.reject("请求失败！");
        }
    })
}
export const useFetchGet = path => fetchRequest("GET", path);
export const useFetchPost = (path, body) => fetchRequest("POST", path, body);
export const useFetchPut = (path, body) => fetchRequest("PUT", path, body);
export const useFetchDelete = (path, body) => request("DELETE", path, body);