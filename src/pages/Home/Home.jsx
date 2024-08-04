import React, { useRef, useCallback } from 'react';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';

import './Home.scss';
import Navbar from '~/components/Navbars/HomeNavbar';
import Footer from '~/components/Footer';
import Button from '~/components/Buttons/Button';

import IntroVideo from '~/assets/video/Intro-Video.gif';
import TextVideo from '~/assets/video/Text-Video.gif';
import HumanWork from '~/assets/lotties/HumanWork';
import Discuss from '~/assets/lotties/Discuss';
import Winner from '~/assets/lotties/Winner';
import Moutains from '~/assets/images/Moutains.svg';
import { DEFAULT_LOTTIE_OPTIONS } from '~/utils/Const';
import config from '~/config';

function Home() {
  const navigate = useNavigate();
  const handleSelectBtn = useCallback((id) => {
    switch (id) {
      case 'signin':
        navigate('/sign-in');
        break;
      case 'develop':
        break;
      case 'contest':
        navigate(config.routes.contests_management);
        break;
      case 'discuss':
        break;
      default:
        console.error('Action is invalid');
    }
  }, []);

  return (
    <div className="container">
      <Navbar onSelectBtn={handleSelectBtn}></Navbar>
      <section className="intro">
        <img className="intro__video" src={IntroVideo} alt="IntroVideo"></img>
        <Button className="btn--newacc" highlight>
          Create Account
        </Button>
      </section>
      <section className="content">
        <section className="content__group">
          <div id="Developer" className="content__group--title">
            Developer
          </div>
          <div className="content__group--content">
            We now support 14 popular coding languages. At our core, Code Solution is about developers. Our powerful
            development tools such as Playground help you test, debug and even write your own projects online.
          </div>
          <Lottie options={{ ...DEFAULT_LOTTIE_OPTIONS, animationData: HumanWork }} height={400} width={400} />
        </section>
        <section className="content__group">
          <div id="Contest" className="content__group--title">
            Contest
          </div>
          <div className="content__group--content">
            Regularly organized contests featuring diverse questions are designed to assess your programming learning
            journey. Participants come together to compete and determine the winners based on the highest scores and
            shortest completion times.
          </div>
          <Lottie options={{ ...DEFAULT_LOTTIE_OPTIONS, animationData: Winner }} height={400} width={400} />
        </section>
        <section className="content__group">
          <div id="Discuss" className="content__group--title">
            Discuss
          </div>
          <div className="content__group--content">
            Code Solution is a beloved coding community where individuals can pose questions for collaborative
            discussions.
          </div>
          <Lottie options={{ ...DEFAULT_LOTTIE_OPTIONS, animationData: Discuss }} height={400} width={800} />
        </section>
        <section className="content__quote">
          <img className="content__quote--text" src={TextVideo} alt="TextVideo"></img>
          <img className="content__quote--moutains" src={Moutains} alt="Moutains"></img>
        </section>
      </section>
      <Footer></Footer>
    </div>
  );
}

export default Home;
