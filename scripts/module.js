Hooks.once('ready', function () {
  CONFIG.statusEffects.push({
    "id": "fastAction",
    "label": "Fast Action",
    "icon": "modules/alien-actions/assets/fastaction.svg"
  });

  CONFIG.statusEffects.push({
    "id": "slowAction",
    "label": "Slow Action",
    "icon": "modules/alien-actions/assets/slowaction.svg"
  });

  // We put setting selector
  // Define a new setting which can be stored and retrieved
game.settings.register("alien-actions", "mode", {
  name: "Select where the actions will reset",
  hint: "",
  scope: "world",
  config: true,
  type: String,
  choices: {
    "round": "Round Start",
    "turn": "When Turn Arrives"
  },
  default: "turn",
});

});

Hooks.on('updateCombat',  function (e) {
  if (game.user.isGM) {
    if (game.settings.get("alien-actions", "mode") == "round"){
      let combat_token = canvas.tokens.get(e.current.tokenId);
      let combat_actor = combat_token.actor;
      if (e.current.turn == 0) { // if we are in first turn
        //e.combatants.forEach(combatant => {      
        //  canvas.tokens.children[0].children.filter(token => token.data.name == combatant.name).forEach(token => removeActions(token) );
        
        // WE ACTIVATE ALL CANVAS TOKENS!
        canvas.tokens.children[0].children.forEach(token => removeActions(token)); 
      }
      
      else {
            // IF it's a creature with speed > 1 and we are not in first round we activate token again.
        if (combat_actor.type == "creature") { // if its a creature
          if (combat_actor.data.data.attributes.speed.value > 1) {
          removeActions(combat_token);
          }
        }
      } 
    }
    else if (game.settings.get("alien-actions", "mode") == "turn"){
      let combat_token = canvas.tokens.get(e.current.tokenId);
      //let combat_actor = combat_token.actor;
      canvas.tokens.children[0].children.filter(token => token.data.name == combat_token.name).forEach(token => removeActions(token) );
      //removeActions(canvas.tokens.get(e.current.tokenId));   
  }
  }
});



// Clear actions when combat ends.
Hooks.on('deleteCombat', async function (e) {
  canvas.tokens.children[0].children.forEach(token => removeActions(token));
});

async function removeActions(combat_token) {

  let slowAction = combat_token.actor.effects.find(eff => eff.getFlag("core", "statusId") === "slowAction");
  let fastAction = combat_token.actor.effects.find(eff => eff.getFlag("core", "statusId") === "fastAction");

  if (slowAction != undefined) await slowAction.delete();
  if (fastAction != undefined) await fastAction.delete();

};
