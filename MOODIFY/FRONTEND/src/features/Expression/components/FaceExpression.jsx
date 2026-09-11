import { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";

export default function FaceExpression({onClick = () => {}}) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [ expression, setExpression ] = useState("Detecting...");


     
    useEffect(() => {
        init({landmarkerRef, videoRef, streamRef});
        const landmarker = landmarkerRef.current;
        const video = videoRef.current;
        return () => {


            if (landmarker) {
                landmarker.close();
            }

            if (video?.srcObject) {
                video.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    function handleClick(){
        const expression = detect({landmarkerRef, videoRef, setExpression})

        if (expression) {
            onClick(expression)
        }


    }

    return (
        <div style={{ textAlign: "center" }}>
            <video
                ref={videoRef}
                style={{ width: "400px", borderRadius: "12px" }}
                playsInline
            />
            <h2>{expression}</h2>
            <button onClick={handleClick} >Detect expression</button>
        </div>
    );
}