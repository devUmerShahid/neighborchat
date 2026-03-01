import {useState, useEffect} from 'react';

interface GeolocationState{
    longitude: number| null;
    latitude: number| null;
    error: string| null;
}

export const useGeolocation=()=>{
    const [position, setPosition]=useState<GeolocationState>({
        longitude:null,
        latitude:null,
        error:null,
    });

    useEffect(()=>{
        if(!navigator.geolocation){
            setPosition({...position, error:"GeoLocation not supported"});
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos)=>{
                setPosition({
                    longitude:pos.coords.longitude,
                    latitude:pos.coords.latitude,
                    error:null,
                });
            },
            (err)=>{
                setPosition({...position, error:err.message});
            },
            {enableHighAccuracy:true, timeout:10000, maximumAge:0}
        );
    },[]);

    return position;
};