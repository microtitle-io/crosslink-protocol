function About() {
    return (
        <div className="body">
            <div className="text">
                <h1 style={{color: '#FFFFFF'}}>{`{ About }`}</h1>
                Crosslink Protocol is an open-source system for creating NFT titles that are incontrovertibly linked to physical items, secured on the Solana blockchain.
                <div>
                    <ul className="resources">
                        <li><h2>Resources</h2></li>
                        <li>[white paper]: <a className="App-link" href="https://github.com/microtitle-io/crosslink-protocol/blob/main/docs/crosslink-protocol-v0.1b.pdf" target="_blank" rel="noopener noreferrer">crosslink-protocol-v0.1b.pdf</a></li>
                        <li>[medium]: <a href="https://medium.com/@microtitle">https://medium.com/@microtitle</a></li>
                        <li>[twitter]: <a href="https://twitter.com/microtitle_io">https://twitter.com/microtitle_io</a></li>
                        <li>[github]: <a href="https://github.com/microtitle-io/crosslink-protocol">https://github.com/microtitle-io/crosslink-protocol</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default About;