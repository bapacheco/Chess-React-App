import Body from "../components/Body";
import Play from "../components/Play";


export default function PlayPage() {
// play would have mode={}, in mode would be "local", "online", etc
//todo
    //switch here for type of game (function) to and pass it as prop to play
    return (
        <Body>
            <Play />
        </Body>
    )
}