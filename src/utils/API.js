const API_KEY = process.env.REACT_APP_API_KEY;

export function getCoordinatesURI(location){
    return `https://api.openrouteservice.org/geocode/autocomplete?api_key=${API_KEY}&text=${location}`
}

export function getRoutesURI(co_ord_1, co_ord_2){
    return `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${co_ord_1[0]},${co_ord_1[1]}&end=${co_ord_2[0]},${co_ord_2[1]}`
}