// On page is ready
$(window).load(function() {
  console.log('Its loaded');

  // Initialize each modules
  PhpUnitGen.Mobile.initialize();
  PhpUnitGen.FormListener.initialize();
  PhpUnitGen.PageLoader.initialize();
  PhpUnitGen.Config.initialize();
  PhpUnitGen.Tab.initialize();
  PhpUnitGen.EditorListener.initialize();

  $('#app-loader').fadeOut(500);
});
