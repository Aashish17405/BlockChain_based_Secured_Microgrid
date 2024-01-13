import './styles.css';

const Home = () => {
    
    const videoUrl = 'https://www.youtube.com/embed/ATqA6rFWuiQ';
    return ( 
        <div className='content'>
        <div className="home">
            <h1 style={{margin:"30px", paddingLeft:"41px"}}>Welcome to the Microgrid </h1>
            <div>
                <div className="box-1">
                    <p className="matter">
                    Grid Smart Tech is a pioneering company specializing in smart-controlled microgrids. They develop cutting-edge technology solutions that enable efficient and intelligent management of microgrids. Their innovative systems empower users to control and optimize energy distribution on a smaller scale, enhancing reliability and sustainability while offering customizable, smart-grid solutions for various energy needs. Grid Smart Tech's focus lies in creating advanced, responsive, and adaptable microgrid systems that revolutionize the way energy is managed and utilized.
                    </p>
                </div>
            </div>
            <div className="video-container">
                <iframe width="560" height="315" src={videoUrl} title="YouTube Video" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen // Enable fullscreen mode
                />
            </div>
            <div>
                <div className="quotes-container">
                    <p className='quote'>
                        "We owe it to ourselves and to the next generation to conserve the environment so that we can bequeath our children a sustainable world that benefits all." - A. P. J. Abdul Kalam
                    </p>
                    <p className='quote'>
                        "Don't be reckless with electricity; use it wisely, conserve it for a brighter future." <br></br>- Chetan Bhagat
                    </p>
                </div>
            </div>
            <div>
                <div id="full">
                    <h1 id="hea">The Science behind  Microgrid</h1>
                    
                    <p id="simp">Through blockchain technology and our own innovative solutions, we've developed Exergy, a permissioned data platform<br />
                    that creates a localized energy marketplace for transacting energy across existing grid infrastructure.<br />
                    We're just beginning to uncover the potential of the Exergy platform to influence the energy model of the future, and<br />
                    already the possibilities seem endless.</p><br/>

                    <div id="pics">
                        <img className="pic" src="https://static.wixstatic.com/media/19690a_9ad0ce441cb54e3ca59a6414132a5c2a~mv2.png/v1/fill/w_140,h_98,al_c,lg_1,q_85,enc_auto/19690a_9ad0ce441cb54e3ca59a6414132a5c2a~mv2.png" alt="peer to peer" />
                        <img className="pic" src="https://static.wixstatic.com/media/19690a_4ff53e0cae97412c9b5a3bc58de76daf~mv2.png/v1/fill/w_140,h_98,al_c,lg_1,q_85,enc_auto/19690a_4ff53e0cae97412c9b5a3bc58de76daf~mv2.png" alt="microgrid" />
                        <img className="pic" src="https://static.wixstatic.com/media/19690a_10913ea78708457d9ee57cd8460d44a9~mv2.png/v1/fill/w_140,h_98,al_c,lg_1,q_85,enc_auto/19690a_10913ea78708457d9ee57cd8460d44a9~mv2.png" alt="dso" />
                        <img className="pic" src="https://static.wixstatic.com/media/19690a_f0dad827e1b14203b13e7b09ff5f9bba~mv2.png/v1/fill/w_140,h_98,al_c,lg_1,q_85,enc_auto/19690a_f0dad827e1b14203b13e7b09ff5f9bba~mv2.png" alt="ev charging" />
                    </div>

                    <div className="para-container">
                        <p className="para">
                            <span className="first-line">Peer-to-Peer</span><br />
                            On the Exergy platform,<br />
                            prosumers - generating<br />
                            energy through their own<br />
                            renewable sources - can<br />
                            transact energy<br />
                            autonomously in near-real<br />
                            time with consumers on the <br />
                            platform in their local <br />
                            marketplace. <br />
                        </p>
                        <p className="para">
                            <span className="first-line">Microgrid</span><br />
                            A microgrid is an <br />
                            ecosystem of <br />
                            connected prosumer <br />
                            and consumer energy <br />
                            assets. Energy is <br />
                            generated, stored <br />
                            and transacted locally <br />
                            creating more <br />
                            efficient, resilient and <br />
                            sustainable <br />
                            communities.<br />
                        </p>
                        <p className="para">
                            <span className="first-line">DSO</span><br />
                            The distributed system<br /> 
                            operator is granted <br />
                            access to consumer <br />
                            data like building <br />
                            management systems.<br />
                            Using price as a proxy.<br /> 
                            the distributed <br />
                            system operator <br />
                            manages energy use, <br />
                            load balancing, and <br />
                            demand response at <br />
                            negotiated rates.<br />
                        </p>
                        <p className="para">
                            <span className="first-line">EV Charging</span><br />
                            When a charging station-<br /> 
                            public or private-or an <br />
                            electric vehicle has a surplus<br /> 
                            of energy, it is made <br />
                            available for purchase on <br />
                            the local network.<br />
                            Consumers can set budgets<br /> 
                            and be alerted to the <br />
                            availability via mobile app.<br />
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
} 
export default Home;