import React, { Component } from 'react';
import UserProfile from '../../components/UserProfile';
import "./style.css";
import NavBar from '../../components/NavBar';
import { Modal, ModalHeader, ModalBody, FormGroup, Label} from 'reactstrap';
import Api from '../../utils/API';
//import { Serializer } from 'v8';

const initialState = {
    toptext: "",
    bottomtext: "",
    isTopDragging: false,
    isBottomDragging: false,
    topY: "10%",
    topX: "50%",
    bottomX: "50%",
    bottomY: "90%"
}

// const photos = [
//     { src: '/images/vict-baby.png' },
//     { src: '/images/ned.jpeg' },
//     { src: '/images/devilgirl.jpg' },
//     { src: '/images/trump.jpg' },
//     { src: '/images/one-does-not.jpg' },
//     { src: '/images/dank.png' },
//     { src: '/images/boy.png' },
//     { src: '/images/sad.png' },
//     { src: '/images/nelio.jpg' },
//     { src: '/images/wolf.png' },
//     { src: '/images/fry.jpg' },
//     { src: '/images/jobs.jpg' },
//     { src: '/images/phone.jpg' },
//     { src: '/images/oldie.png' },
//     { src: '/images/image.png' },
//     { src: '/images/doubt.png' },
//     { src: '/images/crying.png' },
//     { src: '/images/sponge.png' },
//     { src: '/images/dog.png' },
//     { src: '/images/frust.png' },
//     { src: '/images/web.png' },
//     { src: '/images/penguin.png' }
// ];

class MemeMaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: "",
            currentImage: 0,
            modalIsOpen: false,
            currentImagebase64: null,
            ...initialState,
            baseImgURL: "https://i.imgflip.com/gzlgp.jpg", //
            createdBy:"testUser",
            imageOf:"testUser2"
        }
    }

    componentWillMount() {
        this.setState({images:this.props.userImages} , () => console.log("state set"));        
      }

    saveMeme= () => {
        Api
            .saveMeme(this.state.baseImgURL, this.state.toptext, this.state.topY, this.state.topX, this.state.bottomtext, this.state.bottomY, this.state.bottomX, this.state.createdBy, this.state.imageOf)
            .then(memeSaved => {
                // debugger;
                console.log(JSON.stringify(memeSaved))
        })

    }
    _imageEncode (arrayBuffer) {
        let u8 = new Uint8Array(arrayBuffer)
        let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer),function(p,c){return p+String.fromCharCode(c)},''))
        let mimetype="image/jpeg"
        return "data:"+mimetype+";base64,"+b64encoded
    }
    openImage = (index) => {
    
        debugger
        console.log(index);
        console.log(this.state.images[index]);
        const image = this.state.images[index];
        Api.downloadImage(image).then(imageData=>{
            this.setState(prevState => ({
                currentImage: index,
                modalIsOpen: !prevState.modalIsOpen,
                currentImagebase64: this._imageEncode(imageData.data),
                ...initialState
            }));
          
        })
        
        
    }

    toggle = () => {
        this.setState(prevState => ({
            modalIsOpen: !prevState.modalIsOpen
        }));
    }

    changeText = (event) => {
        this.setState({
            [event.currentTarget.name]: event.currentTarget.value
        });
    }

    getStateObj = (e, type) => {
        let rect =
            this.imageRef.getBoundingClientRect();
        const xOffset = e.clientX - rect.left;
        const yOffset = e.clientY - rect.top;
        let stateObj = {};
        if (type === "bottom") {
            stateObj = {
                isBottomDragging: true,
                isTopDragging: false,
                bottomX: `${xOffset}px`,
                bottomY: `${yOffset}px`
            }
        } else if (type === "top") {
            stateObj = {
                isTopDragging: true,
                isBottomDragging: false,
                topX: `${xOffset}px`,
                topY: `${yOffset}px`
            }
        }
        return stateObj;
    }

    handleMouseDown = (e, type) => {
        const stateObj = this.getStateObj(e, type);
        document.addEventListener('mousemove',
            (event) => this.handleMouseMove(event, type)
        );
        this.setState({ ...stateObj })
    }

    handleMouseMove = (e, type) => {
        if (this.state.isTopDragging || this.state.isBottomDragging) {
            let stateObj = {};
            if (type === "bottom" && this.state.isBottomDragging) {
                stateObj = this.getStateObj(e, type);
            } else if (type === "top" && this.state.isTopDragging) {
                stateObj = this.getStateObj(e, type);
            }
            this.setState({
                ...stateObj
            });
        }
    };

    handleMouseUp = (event) => {
        document.removeEventListener('mousemove', this.handleMouseMove);
        this.setState({
            isTopDragging: false,
            isBottomDragging: false
        });
    }

    // convertSvgToImage = () => {
    //     const svg = this.svgRef;
    //     let svgData = new XMLSerializer().serializeToString(svg);
    //     const canvas = document.createElement("canvas");
    //     canvas.setAttribute("id", "canvas");
    //     const svgSize = svg.getBoundingClientRect();
    //     canvas.width = svgSize.width;
    //     canvas.height = svgSize.height;
    //     const img = document.createElement("img");
    //     img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    //     img.onload = function () {
    //         canvas.getContext("2d").drawImage(img, 0, 0);
    //         const canvasdata = canvas.toDataURL("image/png");
    //         const a = document.createElement("a");
    //         a.download = "meme.png";
    //         a.href = canvasdata;
    //         document.body.appendChild(a);
    //         a.click();
    //     };
    // }

    getBase64Image(img) {
        debugger;
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    }

    render() {
        console.log(this.props.userImages);
        //let images = JSON.stringify(this.props.userImages);
        const image = this.state.images[this.state.currentImage];
        const base_image = new Image();
        base_image.src = image.src;
        base_image.crossOrigin="anonymous";
        //var wrh = base_image.width / base_image.height;
        var newWidth = 600;
        var newHeight = 400;
        const textStyle = {
            fontFamily: "Impact",
            fontSize: "50px",
            textTransform: "uppercase",
            fill: "#FFF",
            stroke: "#000",
            userSelect: "none"
        }

        return (
            <div >


                <div className="row col-12" id="mainBodyDiv">
                <div className="col-12" id="navbarDiv">
            <NavBar/>
            </div>
                    <div id="userProfileDiv">

                        <UserProfile componentDidMount={this.componentDidMount} sessionName={this.props.sessionName} sessionImage={this.props.sessionImage}/>
                    </div>
                    
                    <div id="memeCardDiv">
                        {/* <span>MEEEMMMMEEES</span> */}
                        {this.state.images &&
                        <div className="content">
                            {this.state.images.map((image, index) => (
                                <div className="image-holder" key={image}>
                                    <img crossorigin="anonymous"
                                        style={{
                                            width: "100%",
                                            cursor: "pointer",
                                            height: "100%"
                                        }}
                                        alt={index}
                                        src={image}
                                        onClick={() => this.openImage(index)}
                                        role="presentation"
                                    />
                                    <button id="battleButtonOnMemeMakerContainer" className="btn btn-primary" onClick={() => this.openImage(index)}>Click to BATTLE!</button>
                                </div>
                            ))}

                        </div>
                        }
                    </div>

                    <Modal className="meme-gen-modal" isOpen={this.state.modalIsOpen}>
          <ModalHeader toggle={this.toggle}>Make-a-Meme</ModalHeader>
          <ModalBody>
            <svg
              width={newWidth}
              id="svg_ref"
              height={newHeight}
              ref={el => { this.svgRef = el }}
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink">
              <image
                ref={el => { this.imageRef = el }}
                xlinkHref={this.state.currentImagebase64}
                height={newHeight}
                width={newWidth}
              />
              <text
                style={{ ...textStyle, zIndex: this.state.isTopDragging ? 4 : 1 }}
                x={this.state.topX}
                y={this.state.topY}
                dominantBaseline="middle"
                textAnchor="middle"
                onMouseDown={event => this.handleMouseDown(event, 'top')}
                onMouseUp={event => this.handleMouseUp(event, 'top')}
              >
                  {this.state.toptext}
              </text>
              <text
                style={textStyle}
                dominantBaseline="middle"
                textAnchor="middle"
                x={this.state.bottomX}
                y={this.state.bottomY}
                onMouseDown={event => this.handleMouseDown(event, 'bottom')}
                onMouseUp={event => this.handleMouseUp(event, 'bottom')}
              >
                  {this.state.bottomtext}
              </text>
            </svg>
            <div className="meme-form">
              <FormGroup>
                <Label for="toptext">Top Text</Label>
                <input className="form-control" type="text" name="toptext" id="toptext" placeholder="Add text to the top" onChange={this.changeText} />
              </FormGroup>
              <FormGroup>
                <Label for="bottomtext">Bottom Text</Label>
                <input className="form-control" type="text" name="bottomtext" id="bottomtext" placeholder="Add text to the bottom" onChange={this.changeText} />
              </FormGroup>
              {/* <button onClick={() => this.convertSvgToImage()} className="btn btn-primary">Download</button> */}
              <button onClick={this.saveMeme} className="btn btn-primary">Save to DB</button>
            </div>
          </ModalBody>
        </Modal>
                </div>
            </div>
        )
    }


}


export default MemeMaker;