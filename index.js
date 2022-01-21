Hooks.on('init', function () {
   // override the default on dismiss behavior
   ClientKeybindings._onDismiss = this._onDismiss
})

function _onDismiss(context) {
   // Save fog of war if there are pending changes
   if (canvas.ready) canvas.sight.saveFog();

   // Case 1 - dismiss an open context menu
   if (ui.context && ui.context.menu.length) {
      ui.context.close();
      return true;
   }

   // Case 2 - minimize open UI windows
   if (Object.values(ui.windows).some(w => !w._minimized)) {
      Object.values(ui.windows).forEach(app => {
         if (app.options.minimizable)
            app.minimize();
      });
      return true;
   }

   // Case 3 (GM) - release controlled objects (if not in a preview)
   if (game.user.isGM && canvas.activeLayer && Object.keys(canvas.activeLayer._controlled).length) {
      if (!canvas.activeLayer.preview?.children.length) canvas.activeLayer.releaseAll();
      return true;
   }

   // Case 4 - toggle the main menu
   ui.menu.toggle();
   return true;
}