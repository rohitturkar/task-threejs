import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import photo from "../Assets/image.jpg";

const Cube = () => {
  const mountRef = useRef(null);

  const handleResize = (camera, renderer) => {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  };

  const handleMouseClick = (event, mouse, raycaster, camera, cube) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube);
    if (intersects.length > 0) {
      const faceIndex = intersects[0].faceIndex;
      alert(
        `You clicked on face ${
          Math.floor(faceIndex / 2) + 1
        } at coordinate x=${intersects[0].point.x.toFixed(
          4
        )}, y=${intersects[0].point.y.toFixed(
          4
        )},z=${intersects[0].point.z.toFixed(4)}  `
      );

      console.log(
        `You clicked on face ${
          Math.floor(faceIndex / 2) + 1
        } at cordinate x=${intersects[0].point.x.toFixed(
          4
        )}, y=${intersects[0].point.y.toFixed(
          4
        )},z=${intersects[0].point.z.toFixed(4)} `
      );
    }
  };

  useEffect(() => {
    // Here i have done initial setup for Threejs scene

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Created the cube
    const geometry = new THREE.BoxGeometry();
    const image = new THREE.TextureLoader().load(photo); // loading the image for one of the side
    image.colorSpace = THREE.SRGBColorSpace; //color correction for threejs

    // setting different color for each side and the image for last side
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      new THREE.MeshBasicMaterial({ color: 0x0000ff }),
      new THREE.MeshBasicMaterial({ color: 0xffff00 }),
      new THREE.MeshBasicMaterial({ color: 0xff00ff }),
      new THREE.MeshBasicMaterial({
        map: image,
      }),
    ];

    // creating the cube mesh
    const cube = new THREE.Mesh(geometry, materials);
    cube.castShadow = true; // setting the cube to cast a shadow
    scene.add(cube); //added cube mesh to scene

    // Adding a floor to receive the shadow
    const planeGeometry = new THREE.PlaneGeometry(5, 5);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    planeMaterial.side = THREE.DoubleSide; //Adding double side so that floor is visible from below
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    plane.receiveShadow = true; //setting the floor to receive  shadow
    scene.add(plane);

    // this light will caste the shadow
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    //Adjusting the shadow  properties
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    // This is to add a fog light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight); //added ambientlight to the scene

    // Adding orbitControls to the Zoom and drag-roatate the scene
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 5;
    controls.enableZoom = true;

    //Adding raycaster to get intersection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    //adding rotation animation for cube
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => handleResize(camera, renderer);
    const onMouseClick = (event) =>
      handleMouseClick(event, mouse, raycaster, camera, cube);

    window.addEventListener("resize", onResize);
    window.addEventListener("click", onMouseClick);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("click", onMouseClick);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Cube;
