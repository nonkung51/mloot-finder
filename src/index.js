const ethers = require("ethers");
const temporalLootAbi = require('./temporalLoot.json');
const {LINE_TOKEN, AlchemyAPIKey} = require('./config.json');
const fetch = require('node-fetch');

async function main() {
  let httpProvider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${AlchemyAPIKey}`);

  const mLoot = new ethers.Contract(
    '0x1dfe7Ca09e99d10835Bf73044a23B73Fc20623DF',
		temporalLootAbi,
		httpProvider
  );
    
  for (let i = 419917; i < 1000000; i++) {
    try {
      await mLoot.ownerOf(i);
      console.log(`${i} is owned`);
    } catch (error) {
      const lootHead = await mLoot.getHead(i);
      const lootChest = await mLoot.getChest(i);
      console.log(`${i} is not own with head ${lootHead} and chest ${lootChest}`);
  
      if (
          (lootHead.startsWith('Ornate Helm') && lootChest.startsWith('Ornate Chestplate')) || 
          (lootHead.startsWith('Great Helm') && lootChest.startsWith('Divine Robe')) || 
          (lootHead.startsWith('Great Helm') && lootChest.startsWith('Holy Chestplate'))
        ) {
        console.log(`${i} has the desired loot`);
        await fetch('https://notify-api.line.me/api/notify', { 
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Authorization': 'Bearer ' + LINE_TOKEN 
          }, body: `message=mLoot at ${i} with head ${lootHead}, chest ${lootChest}` 
        });
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
