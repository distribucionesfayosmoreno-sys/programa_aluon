/*funcion para comprobar los parametros del formulario para la puerta AbatibleUnaHoja*/
		function comprobarFormularioPuertaAbatibleUnaHoja() {
			/*Recogemos el valor de los parametros de su formulario y los pasamos a variables*/
			var distribuidor = $('#distribuidor').val();
			var presupuesto = $('#presupuesto').val();
			var fecha = $('#fecha').val();
			var modelo = $('#modelo').val();
			var tipo = $('#tipoPuerta').val();
			var color = $('#color').val();
			var alturaTotalPuertaAbatibleUnaHoja=$('#alturaTotalPuertaAbatibleUnaHoja').val();
			var anchuraTotalPuertaAbatibleUnaHoja=$('#anchuraTotalPuertaAbatibleUnaHoja').val();
			var holguraPuertaAbatibleUnaHoja=$('#holguraPuertaAbatibleUnaHoja').val();
			var bisagrasPuertaAbatibleUnaHoja=$('#bisagrasPuertaAbatibleUnaHoja').val();	
			var largueroPuertaAbatibleUnaHoja=$('#largueroPuertaAbatibleUnaHoja').val();	
			var marcoSuperiorPuertaAbatibleUnaHoja=$('#marcoSuperiorPuertaAbatibleUnaHoja').val();	
			var automatizacionPuertaAbatibleUnaHoja= $('#automatizacionPuertaAbatibleUnaHoja').val();	
			var refuerzoAutomatizacionPuertaAbatibleUnaHoja= $('#refuerzoAutomatizacionPuertaAbatibleUnaHoja').val();	
			var bisagras;
			var portero;
			var larguero;
			var observaciones = $('#observaciones').val();
			
			/*Comprobamos que todos los campos estan correctamente rellenos*/	
			if(alturaTotalPuertaAbatibleUnaHoja.length > 0 && anchuraTotalPuertaAbatibleUnaHoja.length > 0 && holguraPuertaAbatibleUnaHoja.length >= 0  && bisagrasPuertaAbatibleUnaHoja >= 0 && largueroPuertaAbatibleUnaHoja >=0 && automatizacionPuertaAbatibleUnaHoja >=0 && marcoSuperiorPuertaAbatibleUnaHoja >=0){
				$('#capaMedidasPuertaAbatibleUnaHoja').show();
				$('#advertenciaPuertaAbatibleUnaHoja').hide();
				$('#submitFormularioPuertaAbatibleUnaHoja').hide();
				
				/*Ocultamos el todos los partes de trabajo menos el de la puerta AbatibleUnaHoja*/
				$('#desglosePuertaPeatonal').show();
				$('#peatonal').hide();
				$('#vallas').hide();
				$('#abatible_una').show();
				$('#abatible_dos').hide();
				$('#corredera').hide();
				/*Ocultamos el todos los partes de trabajo menos el de la puerta AbatibleUnaHoja*/
				
				/*Deshabilitamos propiedades del formulario para evitar cambios*/
				$('#alturaTotalPuertaAbatibleUnaHoja').prop('disabled', true);
				$('#anchuraTotalPuertaAbatibleUnaHoja').prop('disabled', true);
				$('#holguraPuertaAbatibleUnaHoja').prop('disabled', true);
				$('#bisagrasPuertaAbatibleUnaHoja').prop('disabled', true);
				$('#largueroPuertaAbatibleUnaHoja').prop('disabled', true);
				/*Deshabilitamos propiedades del formulario para evitar cambios*/
				$('#desglosePuertaAbatibleUnaHoja').show();
				$('#etiquetaAcotadoPuertaAbatibleUnaHoja').show();
				$(".campo_distribuidor").text(distribuidor);
				$(".campo_num_presupuesto").text(presupuesto);
				$(".campo_fecha").text(fecha);
				if(modelo==='0'){
					$(".campo_modelo").text("ALUON PREMIUM");
				}else if(modelo==='1'){
					$(".campo_modelo").text("ALUON CLASSIC");
				}else if(modelo==='2'){
					$(".campo_modelo").text("ALUON BISEL");
				}else if(modelo==='3'){
					$(".campo_modelo").text("ALUON INOX");
				}
				
				$(".campo_acabado").text(tipo);
				$(".campo_color").text(color);
				$(".campo_altura_izq").text(alturaTotalPuertaAbatibleUnaHoja);
				$(".campo_altura_der").text(alturaTotalPuertaAbatibleUnaHoja);
				$(".campo_anchura").text(anchuraTotalPuertaAbatibleUnaHoja);
				$(".campo_holgura").text(holguraPuertaAbatibleUnaHoja);
				if(bisagrasPuertaAbatibleUnaHoja==="1"){
					console.log("Bisagras: Derecha");
					$(".campo_bisagra_der").text('X');
				}else if(bisagrasPuertaAbatibleUnaHoja==="0"){
					console.log("Bisagras: Izquierda");
					$(".campo_bisagra_izq").text('X');
				}
				
				if(automatizacionPuertaAbatibleUnaHoja==="1"){
					$(".campo_automatizacion_no").text('X');
				}else if(automatizacionPuertaAbatibleUnaHoja==="0"){
					$(".campo_automatizacion_si").text('X');
				}
							
				$(".campo_observaciones").text(observaciones);
				generarDesglosePuertaAbatibleUnaHoja(alturaTotalPuertaAbatibleUnaHoja, anchuraTotalPuertaAbatibleUnaHoja, holguraPuertaAbatibleUnaHoja, tipo, largueroPuertaAbatibleUnaHoja, modelo, marcoSuperiorPuertaAbatibleUnaHoja, refuerzoAutomatizacionPuertaAbatibleUnaHoja);
			}else{
				$('#capaMedidasPuertaAbatibleUnaHoja').hide();
				$('#advertenciaPuertaAbatibleUnaHoja').show();
			}
		}
		
		function generarDesglosePuertaAbatibleUnaHoja(alturaTotalPuertaAbatibleUnaHoja, anchuraTotalPuertaAbatibleUnaHoja, holguraPuertaAbatibleUnaHoja, tipo, largueroPuertaAbatibleUnaHoja, modelo, marcoSuperiorPuertaAbatibleUnaHoja, refuerzoAutomatizacionPuertaAbatibleUnaHoja){
			console.log('--> generarDesglosePuertaAbatibleUnaHoja');
			var ancho = parseInt(anchuraTotalPuertaAbatibleUnaHoja,10);
			var alto = parseInt(alturaTotalPuertaAbatibleUnaHoja,10);
			var holgura = parseInt('18',10);
			var lama;
			var medidaAnchoInterior;
			var medidaAlturaInterior;
			var numeroDeLamas;
			var lamaRestante;
			var perfilPuerta;
			var holguraLamasVertical = parseInt('125', 10);
			var holguraLamasHorizontal = parseInt('125', 10);
			var sb = "";
			var restaRefuerzoMotor = parseInt('160', 10);
			if(marcoSuperiorPuertaAbatibleUnaHoja==='0'){//SI
				var holguraLargeroSuperior =  parseInt('6', 10);
				if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
					lama = parseInt('200', 10);
				}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 200mm*/
					lama = parseInt('100', 10);
				}else if(modelo==='3'){/*Modelo INOX 21.6cm - 216mm*/ 
					lama = parseInt('216', 10);
				}else if(modelo==='4'){/*Modelo VENECIANA 9.5cm - 95mm*/ 
					lama = parseInt('95', 10);
					holguraLamasHorizontal = parseInt('6', 10);
					restaRefuerzoMotor = parseInt('6', 10);
				}
				if(largueroPuertaAbatibleUnaHoja==='0'){
					perfilPuerta = parseInt('50', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;					
				}else{
					perfilPuerta = parseInt('80', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;
				}
				medidaAlturaInterior = alto - holguraPuertaAbatibleUnaHoja - holguraLargeroSuperior - perfilPuerta;
				
				numeroDeLamas = (medidaAlturaInterior-holguraLamasVertical) / lama;
				lamaRestante = (medidaAlturaInterior-holguraLamasVertical) - (Math.trunc(numeroDeLamas)*lama);
				
				// append some text
				sb+=getCabeceraTabla();
				sb+="<tbody>";
				
					// pintamos los largueros laterales
					if(largueroPuertaAbatibleUnaHoja==='0'){
						sb+=getLineaAdicionalLarguero50x50yAngulo45y90("Larguero Vertical 50x50 con pestaña con corte recto e inglete 45º", "2", alto);
						sb+=getLineaAdicionalLarguero50x50yAngulo45("Larguero Vertical 50x50 con pestaña con corte recto inglete 45º Contrario", "1", ancho);
						if(modelo==='4'){
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else if(modelo==='3'){
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical Inox 100x50 con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else{
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}
					}else{
						sb+=getLineaAdicionalLarguero50x80yAngulo45y90("Larguero Vertical 50x80 con pestaña con corte recto e inglete 45º", "2", alto);
						sb+=getLineaAdicionalLarguero50x80yAngulo45Modelo2("Larguero Vertical 50x80 con pestaña con corte inglete 45º Contrario", "1", ancho);
						if(modelo==='4'){
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else if(modelo==='3'){
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical Inox 100x50 con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else{
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}
					}
					if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
						// lamas
						sb+=getLineaAdicionalLamayAngulo90("Lama 200x20 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamayAngulo90("Lama adicional Lama 200x20 corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior-holguraLamasHorizontal));
						}
					}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 200mm*/
						// lamas
						sb+=getLineaAdicionalLama100yAngulo90("Lama 100x20 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLama100yAngulo90("Lama adicional Lama 100x20 corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior-holguraLamasHorizontal));
						}
					}else if(modelo==='3'){/*Modelo INOX 21,6 cm - 216mm*/
						sb+=getLineaAdicionalLamayAngulo90Inox("Lama 200x26 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-holguraLamasHorizontal-parseInt('35', 10)));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamayAngulo90Inox("Lama adicional Lama 200x26 corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior-holguraLamasHorizontal-parseInt('35', 10)));
						}
						sb+=getLineaAdicionalTuboInoxidable("Tubo Inoxidable 60x20 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-holguraLamasHorizontal-parseInt('35', 10)));
					}else if(modelo==='4'){/*Modelo VENECIANA 9,5cm - 95mm*/
						// lamas
						sb+=getLineaAdicionalLamaAvion125("Lama 100 Avión corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamaAvion125("Lama adicional Lama 100 Avión corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior-holguraLamasHorizontal));
						}
					}
					if(refuerzoAutomatizacionPuertaAbatibleUnaHoja==='0'){
						if(modelo==='3'){
							sb+=getRefuerzoMotorInox("Tubo 50x50 Refuerzo Motor Inoxidable", "1", (medidaAnchoInterior+parseInt('80', 10)));
						}else{
							sb+=getRefuerzoMotor("Tubo 40x15 Refuerzo Motor", "1", (medidaAnchoInterior-restaRefuerzoMotor));
						}
					}
				sb+="</tbody>";
				sb+="</table>";
			}else{//NO
				
				if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
					lama = parseInt('200', 10);
				}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 200mm*/
					lama = parseInt('100', 10);
				}else if(modelo==='3'){/*Modelo INOX 21.6cm - 216mm*/ 
					lama = parseInt('216', 10);
				}else if(modelo==='4'){/*Modelo VENECIANA 9.5cm - 95mm*/ 
					lama = parseInt('95', 10);
					holguraLamasHorizontal = parseInt('6', 10);
					restaRefuerzoMotor = parseInt('6', 10);
				}
				if(largueroPuertaAbatibleUnaHoja==='0'){
					perfilPuerta = parseInt('50', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;					
				}else{
					perfilPuerta = parseInt('80', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;
				}
					
				medidaAlturaInterior = alto - holguraPuertaAbatibleUnaHoja ;
				numeroDeLamas = (medidaAlturaInterior-holguraLamasVertical) / lama;
				lamaRestante = (medidaAlturaInterior-holguraLamasVertical) - (Math.trunc(numeroDeLamas)*lama);
				
				
				// append some text
				sb+=getCabeceraTabla();
				sb+="<tbody>";
				
					// pintamos los largueros laterales
					if(modelo==='4'){
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAlturaInterior);
					}else if(largueroPuertaAbatibleUnaHoja==='0'){
						sb+=getLineaAdicionalLarguero50x50yAngulo90("Larguero Vertical 50x50 con pestaña con corte recto", "2", alto);
						if(modelo==='3'){
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical Inox 100x50 con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else{
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}
					}else{
						sb+=getLineaAdicionalLarguero50x80yAngulo90("Larguero Vertical 50x80 con pestaña con corte recto", "2", alto);
						if(modelo==='3'){
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical Inox 100x50 con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else{
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}
					}
					if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
						// lamas
						sb+=getLineaAdicionalLamayAngulo90("Lama 200x20 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamayAngulo90("Lama adicional Lama 200x20 corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior-holguraLamasHorizontal));
						}
					}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 200mm*/
						// lamas
						sb+=getLineaAdicionalLama100yAngulo90("Lama 100x20 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLama100yAngulo90("Lama adicional Lama 100x20 corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior-holguraLamasHorizontal));
						}
					}else if(modelo==='3'){/*Modelo INOX 21,6 cm - 216mm*/
						sb+=getLineaAdicionalLamayAngulo90Inox("Lama 200x26 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-holguraLamasHorizontal-parseInt('35', 10)));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamayAngulo90Inox("Lama adicional Lama 200x26 corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior-holguraLamasHorizontal-parseInt('35', 10)));
						}
						sb+=getLineaAdicionalTuboInoxidable("Tubo Inoxidable 60x20 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-holguraLamasHorizontal-parseInt('35', 10)));
					}else if(modelo==='4'){/*Modelo VENECIANA 9,5cm - 95mm*/
						// lamas
						sb+=getLineaAdicionalLamaAvion125("Lama 100 Avión corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamaAvion125("Lama adicional Lama 100 Avión corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior-holguraLamasHorizontal));
						}
					}
					if(refuerzoAutomatizacionPuertaAbatibleUnaHoja==='0'){
						if(modelo==='3'){
							sb+=getRefuerzoMotorInox("Tubo 50x50 Refuerzo Motor Inoxidable", "1", (medidaAnchoInterior+parseInt('80', 10)));
						}else{
							sb+=getRefuerzoMotor("Tubo 40x15 Refuerzo Motor", "1", (medidaAnchoInterior-restaRefuerzoMotor));
						}
					}
				sb+="</tbody>";
				sb+="</table>";
			}	
			
			$("#desglose").html(sb);
		}