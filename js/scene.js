import * as THREE from '../js/three.module.js';
import { TWEEN } from '../js/jsm/libs/tween.module.min.js';
import { FBXLoader } from '../js/jsm/loaders/FBXLoader.js';
import { EffectComposer } from '../js/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../js/jsm/postprocessing/RenderPass.js';


let container;
let camera, scene, renderer, ambientLight, pointLight, composer;
let rendering = true;
let loadingManager_r1;
let tree_1, tree_2, about_scene, about_logo_scene, fireplace_scene;
let sectionsSizes = [];
let sectionYPos = [];

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
const idleRadius = 300;
const idleSpeed = 0.003;
const idleSensibility = 0.025;
let idleStore = 0;
let mX, mY;
let targetX = 0;
let targetY = 0;
let mouseX = 0;
let mouseY = 0;
let canvasMaxZ = true;

// default
let camPositions = [];
let camTargetPositions = [];

// 1024
let lgCamPos = [
    {x:2336, y:444, z:593},
    {x:1595, y:-440, z:480},
    {x:890, y:-2125, z:560},
    {x:600, y:-2400, z:690}
];

let lgCamTargetPos = [
    { x: 0, y:511, z:700 },
    { x: 353, y:-910, z:850 },
    { x: 170, y:-2065, z:1030 },
    { x: 0, y:-2500, z:1125 }
];

// < 768 XS
let xsCamPos = [
    {x:5000, y:444, z:593},
    {x:1595, y:1000, z:1000},
    {x:890, y:1000, z:560},
    {x:600, y:1000, z:690}
];

let xsCamTargetPos = [
    { x: 0, y:1200, z:50 },
    { x: 353, y:1000, z:1250 },
    { x: 170, y:1000, z:1030 },
    { x: 0, y:1000, z:1125 }
];

let clickAnimate = false;

function setNav(){
    $('.navbar-nav a').each(function () {
        //$(this).removeClass('active');
        $(this).click(function() {
            let target = $(this).data('href');
            navClickAction(target, this);
        })
    })
}

function navClickAction(target, btn){
    clickAnimate = true;
    $('html, body').animate({
        scrollTop: $(target).offset().top
    },1200, function(){
        // complete
        clickAnimate = false;
    });

    $('.navbar-nav a').each(function () {
        $(this).removeClass('active');
    });
    $(btn).addClass('active');
}

setNav();
init();

function init() {
    checkInnerWidth();
    setSceneLoader_1();
    container = document.createElement( 'div' );
    document.body.prepend( container );

    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( camPositions[0].x, camPositions[0].y, camPositions[0].z);
    camera.lookAt( camTargetPositions[0].x, camTargetPositions[0].y, camTargetPositions[0].z );
    camera.updateMatrixWorld();

    scene = new THREE.Scene();
    let light = new THREE.HemisphereLight( 0xffffff, 0xeeeeee, 1 );
    scene.add( light );

    pointLight = new THREE.PointLight( 0xffffff, 100, 2000 );
    pointLight.position.set( 320, -1980, 1100 );
    scene.add( pointLight );

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.physicallyCorrectLights = true;

    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );
    if(window.innerWidth <= 768){
        $('canvas').css('z-index', 0);
    }else{
        $('canvas').css('z-index', 2000);
    }


    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'scroll', onDocumentScroll, false );

    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass( scene, camera );
    composer.addPass(renderPass);

    $(window).scroll(function(event){
        let st = $(this).scrollTop();
        let i = 0;
        $('.navbar-nav a').each(function () {
            const currLink = $(this);
            if(st >= sectionYPos[i] && st < sectionYPos[i] + sectionsSizes[i]){
                currLink.addClass("active");
            }else{
                currLink.removeClass("active");
            }
            i++;
        });
    });

    setScene_1()

}

function setScene_1(){
    let fbxLoader = new FBXLoader(loadingManager_r1);
    let textureLoader = new THREE.TextureLoader(loadingManager_r1);
    let mainLoaderEnv = new THREE.CubeTextureLoader(loadingManager_r1);
    mainLoaderEnv.setPath('./assets/');
    let mainEnv = mainLoaderEnv.load([
        'px.png', 'nx.png',
        'py.png', 'ny.png',
        'pz.png', 'nz.png'
    ]);
    mainEnv.encoding = THREE.sRGBEncoding;

    let diffuseMap, aoMap;

    diffuseMap = textureLoader.load( './assets/ground_ao.png', (texture) =>{texture.anisotropy = renderer.capabilities.getMaxAnisotropy()} );
    //diffuseMap.encoding = THREE.sRGBEncoding;
    let ground_mat = new THREE.MeshStandardMaterial( {
        map: diffuseMap,
        transparent: diffuseMap
    } );

    aoMap = textureLoader.load( './assets/tree_ao.jpg', (texture) =>{texture.anisotropy = renderer.capabilities.getMaxAnisotropy()} );
    aoMap.encoding = THREE.sRGBEncoding;
    let trunk_mat = new THREE.MeshStandardMaterial({
        color: 0x301407,
        aoMap: aoMap,
        aoMapIntensity: 1
    });

    let leaves_mat = new THREE.MeshStandardMaterial({
        color: 0x93AB31,
        aoMap: aoMap,
        aoMapIntensity: 1
    });

    fbxLoader.load( './assets/tree-01.fbx', function ( object ) {

        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                //console.log(child.name);
                if(child.name === 'ground') child.material = ground_mat;
                if(child.name === 'trunk') child.material = trunk_mat;
                if(child.name === 'foliage') child.material = leaves_mat;
                child.receiveShadow = true;
            }
        } );
        tree_2 = object.clone();
        //console.log(object)
        tree_1 = object;
        tree_1.scale.x = 0;
        tree_1.scale.y = 0;
        tree_1.scale.z = 0;

        tree_2.position.x = -930;
        tree_2.position.y = -2780;
        tree_2.position.z = 1220;

        tree_2.scale.x = 0.4;
        tree_2.scale.y = 0.4;
        tree_2.scale.z = 0.4;
        //tree_2.scale = 0.4;

        scene.add( tree_1 );
        scene.add( tree_2 );

    } );


    // ABOUT
    aoMap = textureLoader.load( './assets/about_ao.jpg', (texture) =>{texture.anisotropy = renderer.capabilities.getMaxAnisotropy()} );
    aoMap.encoding = THREE.sRGBEncoding;

    let innerWood = new THREE.MeshStandardMaterial({
        color: 0xb2732d,
        aoMap: aoMap,
        aoMapIntensity: 1
    });

    let hammerMetal = new THREE.MeshStandardMaterial({
        color: 0x868686,
        aoMap: aoMap,
        aoMapIntensity: 1
    });

    let hammerHandle = new THREE.MeshStandardMaterial({
        color: 0x633017,
        aoMap: aoMap,
        aoMapIntensity: 1
    });

    let bark = new THREE.MeshStandardMaterial({
        color: 0x301407,
        aoMap: aoMap,
        aoMapIntensity: 1
    });

    let green = new THREE.MeshStandardMaterial({
        color: 0x93AB31,
        aoMap: aoMap,
        aoMapIntensity: 1
    });


    aoMap = textureLoader.load( './assets/about_ground_ao.png', (texture) =>{texture.anisotropy = renderer.capabilities.getMaxAnisotropy()} );
    aoMap.encoding = THREE.sRGBEncoding;
    let aboutGround = new THREE.MeshStandardMaterial( {
        map: aoMap,
        transparent: aoMap
    } );

    fbxLoader.load( './assets/about.fbx', function ( object ) {
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                if(child.name === 'about'){
                    child.material[0] = innerWood;
                    child.material[1] = hammerMetal;
                    child.material[2] = hammerHandle;
                    child.material[3] = bark;
                    child.material[4] = green;
                }
                if(child.name === 'about-ground'){
                    child.material = aboutGround;
                }
            }
        });
        about_scene = object;
        about_scene.position.x = 285;
        about_scene.position.y = -1100;
        about_scene.position.z = 1270;
        scene.add(about_scene);
    });

    diffuseMap = textureLoader.load( './assets/leaf.png', (texture) =>{texture.anisotropy = renderer.capabilities.getMaxAnisotropy()} );
    diffuseMap.encoding = THREE.sRGBEncoding;
    let logo_mat = new THREE.MeshStandardMaterial( {
        //color: 0xffffff,
        map: diffuseMap,
        transparent: diffuseMap
    } );

    fbxLoader.load( './assets/logo_plane.fbx', function ( object ) {
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material = logo_mat;
            }
        });
        about_logo_scene = object;
        about_logo_scene.position.x = 285;
        about_logo_scene.position.y = -1100;
        about_logo_scene.position.z = 1270;
        about_logo_scene.scale.x = 1.2
        about_logo_scene.scale.y = 1.2
        about_logo_scene.scale.z = 1.2
        scene.add(about_logo_scene);
    });

    aoMap = textureLoader.load( './assets/fireplace_ao.jpg' );
    //aoMap.encoding = THREE.sRGBEncoding;

    let roughnessMap = textureLoader.load( './assets/roughness.jpg' );
    aoMap.encoding = THREE.sRGBEncoding;

    let fireplace = new THREE.MeshStandardMaterial({
        color: 0x1d2124,
        envMapIntensity: 1,
        envMap: mainEnv,
        roughnessMap: roughnessMap,
        roughness: 0.4,
        aoMap: aoMap,
        aoMapIntensity: 1
    });

    let fireplace_bark = new THREE.MeshStandardMaterial({
        color: 0x301407,
        aoMap: aoMap,
        aoMapIntensity: 1
    });

    let fireplace_wood = new THREE.MeshStandardMaterial({
        color: 0xb2732d,
        aoMap: aoMap,
        aoMapIntensity: 1
    });

    aoMap = textureLoader.load( './assets/fireplace-ground.png' );
    aoMap.encoding = THREE.sRGBEncoding;
    let fireplace_ground = new THREE.MeshStandardMaterial( {
        map: aoMap,
        transparent: aoMap
    } );

    let fireplace_window = new THREE.MeshStandardMaterial( {
        color: 0x000000,
        envMap: mainEnv,
        envMapIntensity: 1,
        roughness: 0.5,
        transparent : true,
        opacity: 0.3
    } );

    diffuseMap = textureLoader.load( './assets/fire.png', (texture) =>{texture.anisotropy = renderer.capabilities.getMaxAnisotropy()} );
    //diffuseMap.encoding = THREE.sRGBEncoding;
    let fire = new THREE.MeshStandardMaterial( {
        side: THREE.DoubleSide,
        depthWrite: false,
        //depthTest: false,
        //color: 0xffffff,
        emissive: 0xff8905,
        emissiveMap: diffuseMap,
        emissiveIntensity: 1,
        map: diffuseMap,
        transparent: diffuseMap
    } );

    fbxLoader.load( './assets/fireplace.fbx', function ( object ) {
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                if(child.name === 'fireplace'){
                    child.material[0] = fireplace;
                    child.material[1] = fireplace_bark;
                    child.material[2] = fireplace_wood;
                }
                if(child.name === 'fireplace-window'){
                    child.material = fireplace_window;
                }
                if(child.name === 'ground-fireplace'){
                    child.material = fireplace_ground;
                }
                if(child.name === 'fire'){
                    child.material = fire;
                }
            }
        });
        fireplace_scene = object;
        fireplace_scene.position.x = 285;
        fireplace_scene.position.y = -2200;
        fireplace_scene.position.z = 1270;

        scene.add(fireplace_scene);
    });
}

function setSceneLoader_1(){
    loadingManager_r1 = new THREE.LoadingManager();
    loadingManager_r1.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        //console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        let percent = Math.round(itemsLoaded / itemsTotal * 100) + '%';
        //console.log(percent);
        $('#progress-bar').css('width', percent);
    };

    loadingManager_r1.onLoad =  () => {
        setTimeout(() =>{
            $('#progress-bar').remove();
            const loadingScreen = document.getElementById( 'loading-screen' );
            loadingScreen.classList.add( 'fade-out' );
            loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
            //console.log(window.scrollY);
            $('section').removeClass('d-none');
            $('footer').removeClass('d-none');
            getSectionsSize();

            new TWEEN.Tween( tree_1.scale )
                .to( {x: 1, y: 1, z: 1}, 2000 )
                .easing( TWEEN.Easing.Bounce.Out )
                .start();
            AOS.init({duration: 600});
            animate();

        },500);
    }
}

function animate() {
    //console.log(window.innerWidth);
    if ( scene ) {
        tree_1.rotation.y += .0025
        tree_2.rotation.y += .0025
        about_scene.rotation.y += .0025

        if(idleStore <= 360){
            idleStore += idleSpeed;
        }else{
            idleStore = 0;
        }
        let x, y;

        if(isNaN(mX)){
            x = windowHalfX + Math.cos(idleStore) * idleRadius;
            y = windowHalfY + Math.sin(idleStore) * idleRadius;

        }else{
            x = mX + Math.cos(idleStore) * idleRadius;
            y = mY + Math.sin(idleStore) * idleRadius;
        }
        mouseX = ( x - windowHalfX )/5;
        mouseY = ( y - windowHalfY )/5;
        targetX = mouseX * .0025;
        targetY = mouseY * .0025;
        about_logo_scene.rotation.y += idleSensibility * ( targetX - about_logo_scene.rotation.y );
        //about_logo_scene.rotation.x += idleSensibility * ( targetY - about_logo_scene.rotation.x );
        fireplace_scene.rotation.y += idleSensibility * ( targetX - fireplace_scene.rotation.y );
        //fireplace_scene.rotation.x += idleSensibility * ( targetY - fireplace_scene.rotation.x );
    }
    TWEEN.update();
    /*if(clickAnimate){
        if(window.scrollY > 0){
            //console.log('anim click = true');
            updateCamera();
        }
    }else{
        //console.log('anim click = false');
        updateCamera();
    }*/
    composer.render();
    if(rendering) requestAnimationFrame( animate );
}

function updateCamera(){
    let starts = [];
    let stops = [];
    starts.push(0);
    stops.push(sectionsSizes[0]);

    //console.log(window.scrollY);
    //console.log(stops[0]);

    if(window.scrollY <= stops[0]){
        //console.log('passed');
        moveCam(0, starts[0], stops[0], false);
    }

    starts.push(sectionYPos[1]);
    stops.push(starts[1] + (sectionsSizes[1]));
    if(window.scrollY >= starts[1] && window.scrollY < stops[1] ){
        moveCam(1, starts[1], stops[1], false);
    }
    starts.push(sectionYPos[2]);
    stops.push(starts[2] + (sectionsSizes[2]));
    if(window.scrollY >= starts[2] && window.scrollY < stops[2] ){
        moveCam(2, starts[2], stops[2], false);
    }
}

function moveCam(i, start, stop, circle){
    let xMove = getCameraTranslation(camPositions[i].x, camPositions[(i+1)].x);
    let yMove = getCameraTranslation(camPositions[i].y, camPositions[(i+1)].y);
    let zMove = getCameraTranslation(camPositions[i].z, camPositions[(i+1)].z);
    //console.log(camPositions[(i+1)].z);
    let totalPixMove = stop - start;
    if(!circle){
        camera.position.x =  Math.round(camPositions[i].x + ((window.scrollY - start) * xMove) / totalPixMove);
        camera.position.z =  Math.round(camPositions[i].z + ((window.scrollY - start) * zMove) / totalPixMove);
    }else{
        let val = 0.025;
        camera.position.x = Math.round(camera.position.x * Math.cos(((window.scrollY - start) * val) / totalPixMove) + camera.position.z * Math.sin(((window.scrollY - start) * val) / totalPixMove));
        camPositions[2].x = camera.position.x;
        camera.position.z = Math.round(camera.position.z * Math.cos(((window.scrollY - start) * val) / totalPixMove) - camera.position.x * Math.sin(((window.scrollY - start) * val) / totalPixMove));
        camPositions[2].z = camera.position.z;

    }
    camera.position.y =  Math.round(camPositions[i].y + ((window.scrollY - start) * yMove) / totalPixMove);

    let xTargetMove = getCameraTranslation(camTargetPositions[i].x, camTargetPositions[(i+1)].x);
    let lookAtX = Math.round(camTargetPositions[i].x + ((window.scrollY - start) * xTargetMove) / totalPixMove);

    let yTargetMove = getCameraTranslation(camTargetPositions[i].y, camTargetPositions[(i+1)].y);
    let lookAtY = Math.round(camTargetPositions[i].y + ((window.scrollY - start) * yTargetMove) / totalPixMove);

    let zTargetMove = getCameraTranslation(camTargetPositions[i].z, camTargetPositions[(i+1)].z);
    let lookAtZ = Math.round(camTargetPositions[i].z + ((window.scrollY - start) * zTargetMove) / totalPixMove);

    //console.log(camera.position.x + ' - ' + camera.position.y + ' - ' + camera.position.z);

    camera.lookAt( lookAtX, lookAtY, lookAtZ);
}

function getCameraTranslation(a, b){
    let move;
    if(a > b){
        move = 0 - (a - b);
    }else if(a < b){
        move = b - a;
    }else{
        move = 0;
    }
    return move;
}

let xT = void 0,
    yT = void 0,
    dx = void 0,
    dy = void 0;

function followMouse() {
    if(!xT || !yT) {
        xT = mX;
        yT = mY;
    } else {
        dx = (mX - xT) * 0.125;
        dy = (mY - yT) * 0.125;
        if(Math.abs(dx) + Math.abs(dy) < 0.1) {
            xT = mX;
            yT = mY;
        } else {
            xT += dx;
            yT += dy;
        }
    }
    return {x: xT, y: yT}
}

function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouseX = ( event.clientX - windowHalfX )/5;
    mouseY = ( event.clientY - windowHalfY )/5;
    mX = event.clientX;
    mY = event.clientY;
}

function onDocumentScroll(event){
    //console.log(window.scrollY);
    if(window.scrollY > window.innerHeight){
        if(canvasMaxZ){
            console.log('-> Z0')
            canvasMaxZ = false;
            $('canvas').css('z-index', 0);
        }
    }else{
        if(!canvasMaxZ){
            console.log('-> Z2000')
            canvasMaxZ = true;
            if(window.innerWidth <= 768){
                $('canvas').css('z-index', 0);
            }else{
                $('canvas').css('z-index', 2000);
            }
        }
    }
    if(clickAnimate){
        if(window.scrollY > 0){
            //console.log('anim click = true');
            updateCamera();
        }
    }else{
        //console.log('anim click = false');
        updateCamera();
    }
}

function getSectionsSize(){
    let yPos = 0;
    $('section').each(function(){
        sectionsSizes.push($(this).height());
        sectionYPos.push(yPos);
        yPos += $(this).height();
    });
    console.log("sectionsSizes");
    console.log(sectionsSizes);
    console.log("sectionYPos");
    console.log(sectionYPos);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    sectionsSizes = [];
    sectionYPos = [];
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    getSectionsSize();
    checkInnerWidth();

}

function checkInnerWidth(){
    if(window.innerWidth <= 768){
        camPositions = xsCamPos;
        camTargetPositions = xsCamTargetPos;
    }else{
        if(window.innerWidth <= 992 && window.innerWidth > 768){
            camPositions = lgCamPos;
            camTargetPositions = lgCamTargetPos;
        }else{
            if(window.innerWidth > 992){
                camPositions = lgCamPos;
                camTargetPositions = lgCamTargetPos;
            }
        }
    }
}

function onTransitionEnd(e){
    $("#loading-screen").remove();
    e.target.remove();
}
