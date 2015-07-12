define(function(require) {
	var Storage 	 = require('Utils/Storage');
	var Geolocate 	 = require('Geolocation/Geolocate');
	var SelfLocation = require('Tools/SelfLocation');
	var Modal 		 = require('Tools/Modal');

	function ProductosCarrito() {
		var geoForm = null;
		var confirmaPedido = $('.confirmar-pedido');

		// Modal de términos y condiciones:
		var modalPoliticas = new Modal('politicasPrivacidad');//(, {close: false});
			modalPoliticas.set('content', '<iframe src="' + url_politicas + '" frameborder="0" width=800 height=400></iframe>')

		var modalTerminos = new Modal('terminosCondiciones');//(, {close: false});
			modalTerminos.set('content', '<iframe src="' + url_terminos + '" frameborder="0" width=800 height=400></iframe>')


		$('label[for="ProductoTerminos"] .politicas-privacidad').click(function() {
			modalPoliticas.show();
		})

		$('label[for="ProductoTerminos"] .terminos-condiciones').click(function() {
			modalTerminos.show();
		})

		// Si existe el nombre de la dirección lo pone en Direccione
		if( $('#ProductoNombreDireccion').length ) {
			$('#ProductoNombreDireccion').on('change', function() {
				var visible = $('#ProductoOtroNombre').is(':visible');
				if($(this).value() == 'Otro' && !visible) {
					$('#DireccioneNombre').value('');
					$('#ProductoOtroNombre').show().focus().on('keyup', function() {
						$('#DireccioneNombre').value($(this).value())
					});

					return;
				} else if($(this).value() != 'Otro' && visible) {
					$('#ProductoOtroNombre').hide().off().value('');
				}

				$('#DireccioneNombre').value($(this).value())
			})
		}

		// Implementa NIT:
		$('input[name="facturar_empresa"]').change(function() {
			$('#emp_cont').toggle();
		})

		// Validaciones antes de permitir el submit del carrito..
		var lastGeoAddress = Storage.value('geo_address') || false
		if( lastGeoAddress !== false ) lastGeoAddress = JSON.parse( lastGeoAddress )

		// Ajusta el alto de las cajas para que se vea bien bonito todo *_*
		function updateSize() {
			var columns = $('.column');
			var prevHeight = 0;

			columns.css('height', '');
			columns.each(function(i) {
				var bbox = $(this).box();
				if(prevHeight == 0) {
					prevHeight = bbox.height
				} else {
					if(prevHeight > bbox.height) {
						$(this).css('height', prevHeight + 'px')
					} else {
						columns.eq(i-1).css('height', bbox.height + 'px')
					}
				}
			})
		}

		updateSize();

		// Guarda la caja de comentarios cada vez que el usuario escribe para al hacer back
		// tenga disponible los comentarios:

		$('.comments-box').on('keyup', function() {
			Storage.value('comment', this.value)
		})

		var form = $('#ProductoCarritoForm');

		// Si se edita o se cambia un input resetea el lat,lng para volverlo a pedir al server
		form.find('*[name*="dir"]').change(function() {
			$('.carrito-login input[name="lat"]').value('')
			$('.carrito-login input[name="lat"]').value('')
		});

		geoForm = new Geolocate('.new_address', function(response) {
			if(response) {
				Storage.value('geo_address', JSON.stringify(response))
				$('*[name="lat"]').value(response.lat);
				$('*[name="lng"]').value(response.lng);

				form.attr('allowsubmit', '');
				form.submit();
			} else {
				// Abrir mapa
				SelfLocation.show(function(lat, lng) {
					if(lat === false) {
						confirmaPedido.removeClass('loading');
						return false;
					}

					$('*[name="lat"]').value(lat);
					$('*[name="lng"]').value(lng);

					form.attr('allowsubmit', '');
					form.submit();
				})
			}
		}, false) // Este false nos permite ejecutar el GEO cuando se quirea al llamar geoForm.formSubmit()

		// Si es usuario y estoy viendo las direcciones guardadas entonces el form
		// es novalidate por defecto
		if( $('.carrito-login').hasClass('guest') === false
		&&  $('.new_address').is(':visible') === false ) {
			form.attr('novalidate', '');
		}

		// Hook al botón de enviar el pedido para validar que todo esté llenado correctamente, entra acá cuando se puede enviar el form
		form.on('submit', function(e) {
			e.preventDefault()
			confirmaPedido.addClass('loading');

			var current_lat = $('.carrito-login input[name="lat"]').val();
			var current_lng = $('.carrito-login input[name="lat"]').val();

			// Pone los comentarios en el pedido
			$('#ProductoComentarios').value( $('.comments-box').value() );

			// Primer submit
			if(form.attr('allowsubmit') == null) {
				if( $('.carrito-login').hasClass('guest') ) {
					// Valida que el nombre del usuario tenga mínimo 2 palabras:
					var nombreUsuario = $('#RecibeNombre').value()
					if(nombreUsuario == '' || nombreUsuario.split(' ').length < 2) {
						alert(language.carrito.ingresa_nombre);
						$('html, body').animate({scrollTop: $('#RecibeNombre').addClass('error').offset().top - 30});
						confirmaPedido.removeClass('loading');
						return false;
					}

					var validateForm = validateFormFields(this, $('.add_address'))
					var validateUserForm = validateFormFields(this, $('.new-block'))

					if( validateForm 	 === false
					 && validateUserForm === false
					 && current_lng == ''
					 && current_lat == '' ) { // No tiene errores, preguntar GPS
						// Este hace trigger de nuevo
						geoForm.formSubmit()
						return false;
					} else {
						confirmaPedido.removeClass('loading');

						$('html, body').animate({scrollTop: $('input.error').first().offset().top - 30});
						return false;
					}
				} else {
					if( validateFormField($('#RecibeNombre')) === true) {
						// Hay error, no permitir el submit
						$(this).removeAttr('allowsubmit');
						confirmaPedido.removeClass('loading');

						$('html, body').animate({scrollTop: $('#RecibeNombre').first().offset().top - 30});
						return false;
					}

					// Si tengo el formulario abierto en new, entonces valido los campos de la dirección:
					if($('.new_address').is(':visible')) {
						var validateForm = validateFormFields(this, $('.add_address'))

						if( validateForm === false
						 && current_lat == ''
						 && current_lng == '') { // No tiene errores, preguntar GPS
							geoForm.formSubmit() // Este hace trigger de nuevo
							return false;
						}

						confirmaPedido.removeClass('loading');
						$('html, body').animate({scrollTop: $('input.error').first().offset().top - 30});
						return false;
					} else {
						// Valido que tenga seleccionada una dirección:
						if(parseInt($('#ProductoDireccion').value()) != 0) {
							$(this).attr('allowsubmit', '1');
						} else {
							alert(language.pedido.selecciona_direccion);
							confirmaPedido.removeClass('loading');
							$('html, body').animate({scrollTop: $('#ProductoDireccion').offset().top - 30});
							return false;
						}
					}
				}
			}

			if($('#ProductoNombreDireccion').is(':visible')) {
				if($('#DireccioneNombre').value() == '') {
					alert(language.pedido.nombre_direccion);
					confirmaPedido.removeClass('loading');
					$('#ProductoNombreDireccion').focus().addClass('error');
					return false;
				}
			}

			// Valida que con cuánto paga cumpla con el costo del pedido
			if($('#billete_cont').is(':visible')) {
				var paga_con = $('#ProductoBillete').removeClass('error').value()
					paga_con = parseInt(paga_con.replace(/[^0-9]+/g, ''));

				if(isNaN(paga_con)) {
					alert(language.carrito.con_cuanto_pagas);
					$('#ProductoBillete').addClass('error');
					$(this).removeAttr('allowsubmit');

					confirmaPedido.removeClass('loading');
					return false;
				} else if(paga_con < costo_pedido) {
					alert(language.carrito.pago_minimo);
					$('#ProductoBillete').addClass('error');
					$(this).removeAttr('allowsubmit');

					confirmaPedido.removeClass('loading');
					return false;
				}
			}

/*			if($('#emp_cont').is(':visible')) {
				if($('input[name="data[Producto][nombre_empresa]"]').value() == '') {
					$('input[name="data[Producto][nombre_empresa]"]').addClass('error');
					$('html, body').animate({scrollTop: $('#emp_cont').offset().top - 30});
					alert(language.carrito.ingresa_nombre_empresa);
					confirmaPedido.removeClass('loading');
					return false;
				} else if($('input[name="data[Producto][nit_empresa]"]').value() == '') {
					$('input[name="data[Producto][nit_empresa]"]').addClass('error');
					$('html, body').animate({scrollTop: $('#emp_cont').offset().top - 30});
					alert(language.carrito.ingresa_nit);
					confirmaPedido.removeClass('loading');
					return false;
				}
			}
*/
			if($('#ProductoTerminos').is(':checked') === false) {
				alert(language.carrito.acepta_terminos);
				confirmaPedido.removeClass('loading');
				return false;
			}

/*			if($('*[minlength]').length) {
				var minlength_errors = false;
				$('*[minlength]').each(function() {
					var min = parseInt($(this).attr('minlength'))
					if(!isNaN(min) && $(this).value().length < min) {
						minlength_errors = true;
						$(this).addClass('error')
					}
				});

				if(minlenght_errors) {
					alert(language.carrito.min_length);
					return false;
				}
			}
*/
			form.off();
			form.submit()
		})

		$('.crear-nueva-direccion').click(function() {
			$('.column').css('height', '')
			$('.new-address').slideDown(function() {
				updateSize();
			});

			$('.address-book').slideUp();
			form.removeAttr('novalidate');
		})

		$('.cancelar-nueva-direccion').click(function() {
			$('.column').css('height', '')
			$('.new-address').slideUp(function() {
				updateSize();
			});

			$('.direccion.selected').removeClass('selected');
			$('#ProductoDireccion').value( 0 );

			$('.address-book').slideDown();
			form.attr('novalidate', '');
		})

		// Selección de direcciones del usuario
		$('.direccion').click(function(e) {
			if($(this).hasClass('selected')) {
				$('.direccion.selected').removeClass('selected');
				$('#ProductoDireccion').value( 0 );
				return;
			}

			$('.direccion.selected').removeClass('selected');

			$('#ProductoDireccion').value( this.getAttribute('id') );
			$(this).addClass('selected')
		})


		// Implenta validación del método de pago:
		$('#ProductoFormaPago').on('change', function() {
			if(this.value != 'Efectivo') {
				$('#billete_cont').hide()
			} else {
				$('#billete_cont').show()
			}
		}).trigger('change')
              
//		Validadion del campo telefono que sea un Nro Valido
		$('#telefono').blur(function () {
		    var tel = $('#telefono').val();

		    if (tel.length == 0) {
			alert('debe especificar un telefono');
			$('#telefono').focus();
			return false;
		    } else {
			var letters = tel.split('');
			var numbers = 0;
			$.each(letters, function (k, v) {
			    if ($.isNumeric(v)) {
				numbers = numbers + 1;
			    }
			});
			if (numbers < 7) {
			    alert('no es un telefono valido');
			    $('#telefono').focus();
			}
		    }
		});
	}

	function validateFormFields(form, $container) {
		var hasErrors = false;
		var inputs = $container.find('input[type="text"], select, textarea');

		for(var i = 0; i < inputs.length; i++) {
			var error = validateFormField(inputs[i])
			if(hasErrors == false && error) hasErrors = true;
		}

		if(hasErrors === true) {
			form.removeAttribute('allowsubmit')
		} else {
			form.setAttribute('allowsubmit', '')
		}

		return hasErrors;
	}

	function validateFormField(input) {
		if(!$(input).is(':visible')) return false;
		var input = $(input);
			input.removeClass('error');
		var value = input.value();

		if(value == null || value.length == 0) {
			input.addClass('error');
			return true;
		} return false;
	}

	return new ProductosCarrito()
})
