Hooks.on("ready", function () {
   // override ESC key handler to not shut windows
   keyboard._onEscape = function (event, up, modifiers) {
      if (up || modifiers.hasFocus) return;

      // Save fog of war if there are pending changes
      if (canvas.ready) canvas.sight.saveFog();

      // Case 1 - dismiss an open context menu
      if (ui.context && ui.context.menu.length) ui.context.close();

      // Case 2 - minimize open UI windows
      else if (Object.values(ui.windows).some(w => !w._minimized)) {
         Object.values(ui.windows).forEach(app => {
            if (app.options.minimizable)
               app.minimize();
         });
      }

      // Case 3 (GM) - release controlled objects
      else if (canvas.ready && game.user.isGM && Object.keys(canvas.activeLayer._controlled).length) {
         event.preventDefault();
         canvas.activeLayer.releaseAll();
      }

      // Case 4 - toggle the main menu
      else ui.menu.toggle();

      // Flag the keydown workflow as handled
      this._handled.add(modifiers.key);
   }



})
