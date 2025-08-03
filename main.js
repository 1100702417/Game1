// MetaMask connect and network check
document.getElementById("connectButton").addEventListener("click", async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const netId = await web3.eth.net.getId();
      if (netId !== 96) {
        alert("กรุณาเชื่อมต่อ Bitkub Chain Mainnet (Chain ID: 96)");
      } else {
        document.getElementById("account").innerText = "บัญชี: " + accounts[0];
      }
    } catch (error) {
      alert("ไม่สามารถเชื่อมต่อกระเป๋าได้");
    }
  } else {
    alert("กรุณาติดตั้ง MetaMask ก่อนใช้งาน");
  }
});

// Three.js setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // ฟ้าทะเล

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// พื้นน้ำ
const seaGeometry = new THREE.PlaneGeometry(100, 100);
const seaMaterial = new THREE.MeshStandardMaterial({ color: 0x4fc3f7 });
const sea = new THREE.Mesh(seaGeometry, seaMaterial);
sea.rotation.x = -Math.PI / 2;
sea.position.y = -3;
scene.add(sea);

// เกาะหลัก
const islandGeometry = new THREE.SphereGeometry(4, 64, 64);
const islandMaterial = new THREE.MeshStandardMaterial({ color: 0x8bc34a, flatShading: true });
const island = new THREE.Mesh(islandGeometry, islandMaterial);
island.scale.y = 0.3;
island.rotation.x = Math.PI / 2;
island.position.y = -1.5;
scene.add(island);

// ที่ดิน Plot
const plotPositions = [
  [2, -0.5, 0],
  [-2, -0.5, 0],
  [0, -0.5, 2],
  [0, -0.5, -2],
  [0, 0.2, 0],
];

plotPositions.forEach((pos, index) => {
  const plot = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.2, 1),
    new THREE.MeshStandardMaterial({ color: 0xffeb3b })
  );
  plot.position.set(...pos);
  plot.userData = { id: index + 1 };
  scene.add(plot);
});

// แสง
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// Raycaster สำหรับคลิก
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    const obj = intersects[i].object;
    if (obj.userData.id) {
      alert("คุณคลิกแปลงที่ดินแปลงที่ " + obj.userData.id);
      break;
    }
  }
});

// ปรับขนาดหน้าจอ
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// วนเรนเดอร์
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
