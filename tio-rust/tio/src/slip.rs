/*
SLIP protocol module

Thomas Kornack
Twinleaf LLC 2016
*/

use anyhow::{anyhow, Result};
use std::convert::TryInto;

const SLIP_END: u8 = 0xC0;
const SLIP_ESC: u8 = 0xDB;
const SLIP_ESC_END: u8 = 0xDC;
const SLIP_ESC_ESC: u8 = 0xDD;
const SLIP_MAX_LEN: usize = 2048;
//const SLIP_READ_SIZE : usize = 512;

pub fn tio_slip_decode(rx_slip: &[u8]) -> Result<Vec<u8>> {
    let mut rx_esc_next = false;
    let mut rx_buf = vec![];

    if rx_slip.len() >= SLIP_MAX_LEN {
        return Err(anyhow!("TIO SLIP message too long: {}", rx_slip.len()));
    }

    for byte in rx_slip {
        if rx_esc_next {
            // Escape sequence
            rx_esc_next = false;
            match *byte {
                SLIP_ESC_END => rx_buf.push(SLIP_END),
                SLIP_ESC_ESC => rx_buf.push(SLIP_ESC),
                _ => {
                    return Err(anyhow!("Corrupt SLIP escape character {:x}.", byte));
                }
            }
        } else {
            // Normal character expected
            match *byte {
                SLIP_END => {
                    if rx_buf.len() > 4 {
                        let rx_crc = u32::from_le_bytes(rx_buf[rx_buf.len() - 4..].try_into()?);
                        rx_buf.pop();
                        rx_buf.pop();
                        rx_buf.pop();
                        rx_buf.pop();
                        if rx_crc == crc32fast::hash(&rx_buf) {
                            return Ok(rx_buf);
                        } else {
                            return Err(anyhow!("CRC-32 checksum failed"));
                        }
                    }
                }
                SLIP_ESC => {
                    // Anticipate escaped char
                    rx_esc_next = true;
                }
                _ => {
                    // Normal data
                    rx_buf.push(*byte);
                }
            }
        }
    }
    Err(anyhow!("partial message received (not ending in END)"))
}

pub fn tio_slip_encode(msg: &[u8]) -> Vec<u8> {
    // No doubt double is too much capacity
    let mut slip_msg = Vec::with_capacity(msg.len() * 2);
    slip_msg.push(SLIP_END);
    for byte in msg {
        match *byte {
            SLIP_END => {
                slip_msg.push(SLIP_ESC);
                slip_msg.push(SLIP_ESC_END);
            }
            SLIP_ESC => {
                slip_msg.push(SLIP_ESC);
                slip_msg.push(SLIP_ESC_ESC);
            }
            _ => {
                slip_msg.push(*byte);
            }
        }
    }
    let tx_crc = crc32fast::hash(msg);
    for byte in tx_crc.to_le_bytes() {
        match byte {
            SLIP_END => {
                slip_msg.push(SLIP_ESC);
                slip_msg.push(SLIP_ESC_END);
            }
            SLIP_ESC => {
                slip_msg.push(SLIP_ESC);
                slip_msg.push(SLIP_ESC_ESC);
            }
            _ => {
                slip_msg.push(byte);
            }
        }
    }
    slip_msg.push(SLIP_END);
    slip_msg
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn encode_decode() {
        // Cover all codes
        let mut msg: Vec<u8> = Vec::with_capacity(256);
        for i in 0..255 {
            msg.push(i);
        }

        // Encode
        let slip_msg = tio_slip_encode(&msg);

        // Decode
        let msg2 = tio_slip_decode(&slip_msg).unwrap();
        assert_eq!(&msg[..], &msg2[..])
    }
}
