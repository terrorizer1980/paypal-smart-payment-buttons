/* @flow */
/** @jsx h */

import { h, render, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ZalgoPromise } from 'zalgo-promise/src';
import { type CrossDomainWindowType, getDomain } from 'cross-domain-utils/src';
import { cleanup } from 'belter/src';

import {
    getBody,
    getPostRobot
} from '../lib';
import { QRCODE_STATE } from '../constants';

import { type NodeType,
    ErrorMessage,
    QRCodeElement,
    InstructionIcon,
    Logo,
    VenmoMark,
    AuthMark,
    cardStyle,
    DemoWrapper,
    DemoControls
} from './components';


function useXProps<T>() : T {
    const [ xprops, setXProps ] = useState(window.xprops);
    useEffect(() => xprops.onProps(newProps => {
        setXProps({ ...newProps });
    }), []);
    return { ...xprops };
}


function QRCard({
    cspNonce,
    svgString,
    // demo,
    state,
    errorText = 'An issue has occurred'
} : {|
    cspNonce : ?string,
    svgString : string,
    state? : $Values<typeof QRCODE_STATE>,
    errorText? : string
|}) : NodeType {
    
    // const { 
    //     state, 
    //     errorText = 'An issue has occurred'
    // } = useXProps();

    const [ processState, setProcessState ] = useState(state || null);
    const [ errorMessage, setErrorMessage ] = useState(errorText);
    
    const isError = () => {
        return processState === QRCODE_STATE.ERROR;
    }
    
    return (
        <Fragment>
            <style nonce={ cspNonce }> { cardStyle } </style>
            <div id="view-boxes" className={ processState }>
                { isError() ?
                    <ErrorMessage message={ errorMessage } resetFunc={ ()=> setProcessState(QRCODE_STATE.DEFAULT) } /> :
                    <div id="front-view" className="card">
                        <QRCodeElement svgString={ svgString } />
                        <Logo />
                        <div id="instructions">
                            <InstructionIcon stylingClass="instruction-icon" />
                            To scan QR code, Open your Venmo App
                        </div>
                    </div>}
                <div className="card" id="back-view" >
                    <span className="mark">
                        <VenmoMark />
                        <AuthMark />
                    </span>
                    
                    <div className="auth-message">
                        Go to your Venmo app and authorize
                    </div>
                    <div className="success-message">
                        Venmo account authorized
                    </div>

                </div>
            </div>
        </Fragment>
    );
}


/*
{ demo ?
    <DemoControls
        cspNonce={ cspNonce }
        processState={ processState }
        errorMessage={ errorMessage }
        isError={ isError() }
        setState_error={ (str) => {
            setProcessState(QRCODE_STATE.ERROR);
            setErrorMessage(str);
        } }
        setState_scanned={ () => {
            setProcessState(QRCODE_STATE.SCANNED);
        } }
        setState_authorized={ () => {
            setProcessState(QRCODE_STATE.AUTHORIZED);
        } }
        setState_default={ () => {
            setProcessState(QRCODE_STATE.DEFAULT);
        } }
    /> : null}
*/

type RenderQRCodeOptions = {|
    cspNonce? : string,
    svgString : string,
    demo? : boolean,
    state? : $Values<typeof QRCODE_STATE>,
    errorText? : string
|};

export function renderQRCode({ 
    cspNonce = '', 
    svgString
} : RenderQRCodeOptions) {
    const { 
        state, 
        errorText = 'An issue has occurred'
    } = useXProps();
    render(
        <QRCard
            cspNonce={ cspNonce }
            svgString={ svgString }
            state={ state }
            errorText={ errorText }
        />,
        getBody()
    );
}
