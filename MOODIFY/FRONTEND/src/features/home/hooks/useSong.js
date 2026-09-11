import { useContext } from "react";
import { SongContext } from "../song.context";

export const useSong = () => {
    const context = useContext(SongContext)
    return context
}