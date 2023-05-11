# Pointing Poker

This is a free and open source implementation of pointing [poker (also known as planning poker)](https://en.wikipedia.org/wiki/Planning_poker). It supports various features, such as:

- Multiple rooms
- Observers
- Real time updates
- Responsive/Mobile friendly

## Demo

A demo is hosted [here](https://pointingpoker.app).


### Limitations

This is has been written as a single-instance in-memory application, which (currently) can not horizontally scale. It keeps everything in memory, which means that redeploys will wipe all states and connections.
