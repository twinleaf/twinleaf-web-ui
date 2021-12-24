/*
SLIP protocol module

Thomas Kornack
Twinleaf LLC 2016 
*/

const SLIP_END       : u8 = 0xC0;
const SLIP_ESC       : u8 = 0xDB;
const SLIP_ESC_END   : u8 = 0xDC;
const SLIP_ESC_ESC   : u8 = 0xDD;
const SLIP_MAX_LEN   : usize = 2048;
//const SLIP_READ_SIZE : usize = 512;

pub struct SLIP {
    rx_buf: Vec<u8>,
    rx_esc_next: bool,
}

impl SLIP {

    pub fn new() -> SLIP {
        SLIP {
            rx_buf: Vec::with_capacity(SLIP_MAX_LEN),
            rx_esc_next: false,
        }
    } 

    pub fn rx_dump(&mut self) -> Vec<u8> {
        let rx_buf_clone = self.rx_buf.clone();
        self.rx_buf = Vec::with_capacity(SLIP_MAX_LEN);
        self.rx_esc_next = false;
        rx_buf_clone
    }

    pub fn decode(&mut self, rx_slip: Vec<u8>) -> Option<Vec<u8>> {

        if rx_slip.len() >= SLIP_MAX_LEN {
            self.rx_dump();
            println!("Received a too-long message!");
        }

        for byte in rx_slip {
            if self.rx_esc_next { // Escape sequence
                self.rx_esc_next = false;
                match byte {
                    SLIP_ESC_END => self.rx_buf.push(SLIP_END),
                    SLIP_ESC_ESC => self.rx_buf.push(SLIP_ESC),
                    _ => { // Non-escape-sequence character!
                        self.rx_dump();
                        println!("Corrupt SLIP escape character {:x}.", byte);
                    }
                }
            } else { // Normal character expected
                match byte {
                    SLIP_END => {
                        if self.rx_buf.len() > 0 { 
                            return Some(self.rx_dump()) 
                        } 
                    },
                    SLIP_ESC => { // Anticipate escaped char
                        self.rx_esc_next = true; 
                    },
                    _ => { // Normal data
                        self.rx_buf.push(byte); 
                    }
                }
            }
        }
        None
    }

    pub fn encode(msg: Vec<u8>) -> Vec<u8> {
        // No doubt double is too much capacity
        let mut slip_msg = Vec::with_capacity(msg.len() * 2); 
        slip_msg.push(SLIP_END);
        for byte in msg {
            match byte {
                SLIP_END => {
                    slip_msg.push(SLIP_ESC);
                    slip_msg.push(SLIP_ESC_END);
                },
                SLIP_ESC => {
                    slip_msg.push(SLIP_ESC);
                    slip_msg.push(SLIP_ESC_ESC);
                },
                _ => {
                    slip_msg.push(byte);
                }
            }
        }
        slip_msg.push(SLIP_END);
        slip_msg
    }

}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn encode_decode() {
        // Cover all codes
        let mut msg : Vec<u8> = Vec::with_capacity(256);
        for i in 0..255 { msg.push(i); }

        // Encode
        let slip_msg = SLIP::encode(msg.clone());

        // Decode
        let mut slip = SLIP::new();
        let msg2 = slip.decode(slip_msg).unwrap();
        assert_eq!(&msg[..],&msg2[..])
    }

}
