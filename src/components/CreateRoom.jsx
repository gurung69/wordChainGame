import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { socket } from "../socket";

function CreateRoom(){
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [roomId, setRoomId] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
        setLoading(true);
        socket.emit('create-room', (roomId)=>{
            setRoomId(roomId);
            setLoading(false);
        })
    };

    const handleClose = () => {
        setOpen(false);
        setLoading(true);
    };



    return(
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create Room
            </Button>
    
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>{loading?'Creating Room': 'Room Created'}</DialogTitle>
                <DialogContent>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        {loading? <CircularProgress/>: <p>Room ID: {roomId}</p>}
                    </Box>
                </DialogContent>
                
            </Dialog>
        </>
    )
}

export default CreateRoom;