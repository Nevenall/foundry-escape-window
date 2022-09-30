Hooks.on('init', function () {
   // override the default on dismiss behavior
   ClientKeybindings._onDismiss = context => {
      // Save fog of war if there are pending changes
      if (canvas.ready) canvas.fog.commit();

      // Case 1 - dismiss an open context menu
      if (ui.context && ui.context.menu.length) {
         ui.context.close();
         return true;
      }

      // Case 2 - dismiss an open Tour
      if (Tour.tourInProgress) {
         Tour.activeTour.exit();
         return true;
      }

      // Case 3 - minimize open UI windows
      if (Object.values(ui.windows).some(w => !w._minimized)) {
         Object.values(ui.windows).forEach(app => {
            if (app.options.minimizable)
               app.minimize();
         });
         return true;
      }

      // Case 4 (GM) - release controlled objects (if not in a preview)
      if (game.user.isGM && canvas.activeLayer && canvas.activeLayer.controlled.length) {
         if (!canvas.activeLayer.preview?.children.length) canvas.activeLayer.releaseAll();
         return true;
      }

      // Case 5 - toggle the main menu
      ui.menu.toggle();
      // Save the fog immediately rather than waiting for the 3s debounced save as part of commitFog.
      if (canvas.ready) canvas.fog.save();
      return true;
   }
})

