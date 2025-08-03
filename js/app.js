let web3;
let account;

const BITKUB_CHAIN_ID = 96; // Mainnet
const BITKUB_CHAIN_HEX = '0x60'; // 96 decimal in hex

window.addEventListener('load', async () => {
  if (typeof window.ethereum === 'undefined') {
    alert('กรุณาติดตั้ง MetaMask ก่อนใช้งานเว็บไซต์นี้');
    return;
  }

  web3 = new Web3(window.ethereum);

  // สร้างกริดแผนที่ 3D
  createGrid(25);

  // เชื่อมปุ่ม
  document.getElementById('connectButton').addEventListener('click', connectWallet);
});

async function connectWallet() {
  try {
    // ขอสิทธิ์เชื่อมต่อกระเป๋า
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    account = accounts[0];
    document.getElementById('accountArea').innerText = `บัญชี: ${account}`;

    // ตรวจสอบ chain ID
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    if (chainId !== BITKUB_CHAIN_HEX) {
      try {
        // ขอเปลี่ยนเครือข่ายเป็น Bitkub Chain Mainnet
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BITKUB_CHAIN_HEX }],
        });
        alert('เปลี่ยนเครือข่ายเป็น Bitkub Chain Mainnet สำเร็จ');
      } catch (switchError) {
        // กรณีไม่พบเครือข่ายใน MetaMask ให้เพิ่มเอง
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: BITKUB_CHAIN_HEX,
                chainName: 'Bitkub Chain Mainnet',
                nativeCurrency: {
                  name: 'KUB',
                  symbol: 'KUB',
                  decimals: 18
                },
                rpcUrls: ['https://rpc.bitkubchain.io'],
                blockExplorerUrls: ['https://explorer.bitkubchain.io']
              }]
            });
            alert('เพิ่มเครือข่าย Bitkub Chain Mainnet สำเร็จ กรุณาลองเชื่อมต่อใหม่อีกครั้ง');
          } catch (addError) {
            alert('เพิ่มเครือข่าย Bitkub Chain Mainnet ล้มเหลว');
            console.error(addError);
          }
        }
        console.error(switchError);
      }
    }

    // TODO: เชื่อมต่อ Smart Contract ต่อไป

  } catch (error) {
    alert('เชื่อมต่อ MetaMask ล้มเหลว');
    console.error(error);
  }
}

function createGrid(count) {
  const grid = document.getElementById('mapGrid');
  grid.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.innerText = i;
    tile.onclick = () => onTileClick(i);
    grid.appendChild(tile);
  }
}

function onTileClick(index) {
  alert(`คุณคลิกที่ดินแปลงที่ ${index}\n(สามารถต่อยอดฟีเจอร์ซื้อขายที่ดินได้)`);
}
