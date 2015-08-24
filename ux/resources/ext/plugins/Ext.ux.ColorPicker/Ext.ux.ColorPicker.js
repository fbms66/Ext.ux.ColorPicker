Ext.define('Ext.ux.ColorPicker', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.colorcombo',

    regex: /^\#[0-9A-F]{6}$/i,
    allowBlank: false,
    setOnChange: 'background',

    config: {
        luminanceImg: 'ux/resources/ext/plugins/Ext.ux.ColorPicker/luminance.png',
        spectrumImg: 'ux/resources/ext/plugins/Ext.ux.ColorPicker/spectrum.png',
        value: '#FFFFFF'
    },

    triggers: {
        select: {
            handler: function(self) {
                var me = this;

                if (me.disabled) {
                    return;
                }

                if (!this.menu) {
                    this.menu = Ext.create('Ext.menu.Menu', {
                        plain: true,
                        showSeparator: false,
                        bodyStyle: 'margin-top: 24px; padding-bottom: 24px;',
                        shadowOffset: 24,
                        items: [{
                            xtype: 'box',
                            autoEl: {
                                tag: 'div',
                                height: 195,
                                width: 195,
                                cls: 'ux-color-picker'
                            },
                            getParent: function() {
                                this.up('form');
                            },
                            listeners: {
                                render: function() {
                                    var pickerCanvas = document.createElement('div');
                                    pickerCanvas.className = 'ux-color-picker-canvas';

                                    el = this.el.dom.appendChild(pickerCanvas);
                                    me.drawSpace = el;
                                    me.drawSpectrum();
                                }
                            }
                        }]
                    })
                }
                this.menu.showAt(self.getXY());
            }
        }
    },

    contrastColor: function(color, threshold) {
        threshold = threshold || 160;
        var grayscale = (0.2126 * color[0]) + (0.7152 * color[1]) + (0.0722 * color[2]);
        return (grayscale > threshold) ? '#000' : '#FFF';
    },

    listeners: {
        select: function() {
            var input = document.getElementById(this.id + '-inputEl');

            if (this.setOnChange == 'background') {
                input.style.backgroundColor = this.getValue();
                input.style.color = this.contrastColor(this.getValue());
            } else {
                if (this.setOnChange == 'color') {
                    input.style.color = this.getValue();
                } else {
                    if (typeof this.setOnChange == 'function') {
                        this.setOnChange();
                    }
                }
            }
        },

        afterrender: function() {
            this.fireEvent('select');
        }
    },

    drawSpectrum: function() {
        var me = this;

        !me.isValid() && me.setValue('#FFFFFF');
        me.spectrum = this.drawSpace.appendChild(document.createElement('canvas'));

        var ctx = me.spectrum.getContext('2d');
        me.spectrum.setAttribute('width', '200');
        me.spectrum.setAttribute('height', '200');
        me.spectrum.setAttribute('class', 'ux-color-picker-spectrum');

        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        };
        img.src = me.spectrumImg;
        me.drawLuminance();

        Ext.get(me.spectrum).on('click', function(e, spec) {
            function toHex(r, g, b) {
                var hex = '0123456789ABCDEF';
                return '#' + (
                    hex[parseInt(r / 16)] + hex[parseInt(r % 16)] +
                    hex[parseInt(g / 16)] + hex[parseInt(g % 16)] +
                    hex[parseInt(b / 16)] + hex[parseInt(b % 16)])
            }

            ctx = me.spectrum.getContext('2d');

            var mousePos = {
                x: e.getXY()[0] - Ext.get(spec).getLeft(),
                y: e.getXY()[1] - Ext.get(spec).getTop()
            };

            try {
                var imgData = ctx.getImageData(mousePos.x, mousePos.y, 1, 1);
            } catch (e) {
                return;
            }

            // TODO: Finish this method.
            //me.drawMarker(mousePos.x, mousePos.y, 4);

            if (imgData.data[3] == 0) {
                ctx = me.luminance.getContext('2d');
                imgData = ctx.getImageData(mousePos.x, mousePos.y, 1, 1);

                if (imgData.data[3] == 0) {
                    return;
                }

                me.setValue(toHex(imgData.data[0], imgData.data[1], imgData.data[2]));
            } else {
                me.setValue(toHex(imgData.data[0], imgData.data[1], imgData.data[2]));
                me.drawLuminance();
            }

            me.fireEvent('select');
        })
    },

    // Future method, draws a circle around mouse X,Y point.
    drawMarker: function(xPos, yPos, radius) {
        var me = this;

        if (!me.marker) {
            me.marker = el.appendChild(document.createElement('canvas'));
            me.marker.setAttribute('width', '200');
            me.marker.setAttribute('height', '200');
            me.marker.setAttribute('class', 'ux-color-picker-marker');
        }

        var ctx = me.marker.getContext('2d');

        ctx.clearRect(0, 0, me.marker.width, me.marker.height);

        ctx.beginPath();
        ctx.arc(xPos, yPos, radius, 4, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#444444';
        ctx.stroke();
    },

    drawLuminance: function() {
        var me = this;
        var radius = 65;
        var xOff = 2.5;
        var yOff = 2;

        if (!me.luminance) {
            me.luminance = el.appendChild(document.createElement('canvas'));
            me.luminance.setAttribute('width', '200');
            me.luminance.setAttribute('height', '200');
            me.luminance.setAttribute('class', 'ux-color-picker-luminance');
        }

        var ctx = me.luminance.getContext('2d');

        var center = {
            x: (me.luminance.width / 2) - xOff,
            y: (me.luminance.height / 2) - yOff
        };

        ctx.clearRect(0, 0, me.luminance.width, me.luminance.height);
        ctx.beginPath();
        ctx.fillStyle = me.getValue();
        ctx.strokeStyle = me.getValue();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();

        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, center.x - radius, center.y - radius);
        };
        img.src = me.luminanceImg;
    }
});