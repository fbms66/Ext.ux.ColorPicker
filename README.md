# Ext.ux.ColorPicker

Ext JS 6.x Color Picker Field

Licensed under [cc by-sa 3.0][1] with attribution required.

## Requirements

Requires canvas support and is based on a standard `Ext.form.field.Text` field with triggers, so supports all native properties. Requires ExtJS JS and CSS to be referenced in your page.*

<sup>*Tested with ExtJS 6.x</sup>

## Usage

Specify the location of the luminance and spectrum images, by setting the `luminanceImg` and `spectrumImg` properties on the object (or replacing the two related incidences in the main JS). E.g. 

```javascript
Ext.onReady(function() {
	var colorPicker = Ext.create({
		xtype : 'colorcombo',
		luminanceImg : 'ux/resources/ext/plugins/Ext.ux.ColorPicker/luminance.png',
		spectrumImg : 'ux/resources/ext/plugins/Ext.ux.ColorPicker/spectrum.png',
		value : '#ff0000'
	});
	colorPicker.render('colorPicker');
}); 
```

Additionally, you can pass a HEX color to the `value` property to initialize the field with a pre-selected color.

  [1]: http://creativecommons.org/licenses/by-sa/3.0/