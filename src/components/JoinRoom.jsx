import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { socket } from "../socket";

function JoinRoom(){
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [roomId, setRoomId] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setLoading(false);
    };


    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Join Room
            </Button>
    
            <Dialog onClose={handleClose} open={open}
            slotProps={{
                paper: {
                  component: 'form',
                  onSubmit: (event) => {
                    event.preventDefault();
                    setLoading(true)
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    const roomId = formJson.roomId;
                    
                    socket.emit('join-room', roomId, (response)=>{
                        if (response.success === false){
                            alert(response.message)
                        }
                    })

                    handleClose();
                  },
                },
              }}>
                <DialogTitle>Join Room</DialogTitle>
                <DialogContent>
                    {loading? <CircularProgress/>: <TextField autoFocus required margin="dense"
                    id="roomId" name="roomId" label="Room ID" fullWidth
                    variant="standard"/>}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Join</Button>
                </DialogActions>
                
            </Dialog>
        </>
    )
}

export default JoinRoom;