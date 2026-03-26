/*funcion para comprobar los parametros del formulario para la puerta peatonal*/
		function comprobarFormularioPuertaPeatonal() {
			/*Recogemos el valor de los parametros de su formulario y los pasamos a variables*/
			var distribuidor = $('#distribuidor').val();
			var presupuesto = $('#presupuesto').val();
			var fecha = $('#fecha').val();
			var modelo = $('#modelo').val();
			var tipo = $('#tipoPuerta').val();
			var color = $('#color').val();
			var alturaTotalPuertaPeatonal=$('#alturaTotalPuertaPeatonal').val();
			var anchuraTotalPuertaPeatonal=$('#anchuraTotalPuertaPeatonal').val();
			var holguraPuertaPeatonal=$('#holguraPuertaPeatonal').val();
			var bisagrasPuertaPeatonal=$('#bisagrasPuertaPeatonal').val();	
			var porteroAutomaticoPuertaPeatonal=$('#porteroAutomaticoPuertaPeatonal').val();	
			var largueroPuertaPeatonal=$('#largueroPuertaPeatonal').val();	
			var marcoSuperiorPuertaPeatonal=$('#marcoSuperiorPuertaPeatonal').val();	
			var bisagras;
			var portero;
			var larguero;
			var observaciones = $('#observaciones').val();
			
			/*Comprobamos que todos los campos estan correctamente rellenos*/	
			if(alturaTotalPuertaPeatonal.length > 0 && anchuraTotalPuertaPeatonal.length > 0 && holguraPuertaPeatonal.length >= 0  && bisagrasPuertaPeatonal >= 0 && porteroAutomaticoPuertaPeatonal >=0 && largueroPuertaPeatonal >=0 && marcoSuperiorPuertaPeatonal >=0){
				$('#capaMedidasPuertaPeatonal').show();
				$('#advertenciaPuertaPeatonal').hide();
				$('#submitFormularioPuertaPeatonal').hide();
				
				/*Ocultamos el todos los partes de trabajo menos el de la puerta peatonal*/
				$('#formularioPuertaPeatonal').show();
				$('#peatonal').show();
				$('#vallas').hide();
				$('#abatible_una').hide();
				$('#abatible_dos').hide();
				$('#corredera').hide();
				/*Ocultamos el todos los partes de trabajo menos el de la puerta peatonal*/
				
				/*Deshabilitamos propiedades del formulario para evitar cambios*/
				$('#alturaTotalPuertaPeatonal').prop('disabled', true);
				$('#anchuraTotalPuertaPeatonal').prop('disabled', true);
				$('#holguraPuertaPeatonal').prop('disabled', true);
				$('#bisagrasPuertaPeatonal').prop('disabled', true);
				$('#porteroAutomaticoPuertaPeatonal').prop('disabled', true);
				$('#largueroPuertaPeatonal').prop('disabled', true);
				$('#marcoSuperiorPuertaPeatonal').prop('disabled', true);
				/*Deshabilitamos propiedades del formulario para evitar cambios*/
				$('#desglosePuertaPeatonal').show();
				$('#etiquetaAcotadoPuertaPeatonal').show();
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
				}else if(modelo==='4'){
					$(".campo_modelo").text("ALUON VENECIANA");
				}
				
				$(".campo_acabado").text(tipo);
				$(".campo_color").text(color);
				$(".campo_altura").text(alturaTotalPuertaPeatonal);
				$(".campo_anchura").text(anchuraTotalPuertaPeatonal);
				$(".campo_holgura").text(holguraPuertaPeatonal);
				if(bisagrasPuertaPeatonal==="1"){
					console.log("Bisagras: Derecha");
					$(".campo_bisagra_der").text('X');
				}else if(bisagrasPuertaPeatonal==="0"){
					console.log("Bisagras: Izquierda");
					$(".campo_bisagra_izq").text('X');
				}
				if(porteroAutomaticoPuertaPeatonal==="1"){
					console.log("Portero: No");
					$(".campo_portero_no").text("X");
				}else if(porteroAutomaticoPuertaPeatonal==="0"){
					console.log("Portero: Sí");
					$(".campo_portero_si").text("X");
				}
				
				$(".campo_observaciones").text(observaciones);
				generarDesglosePuertaPeatonal(alturaTotalPuertaPeatonal, anchuraTotalPuertaPeatonal, holguraPuertaPeatonal, tipo, largueroPuertaPeatonal, modelo, marcoSuperiorPuertaPeatonal);
			}else{
				$('#capaMedidasPuertaPeatonal').hide();
				$('#advertenciaPuertaPeatonal').show();
			}
		}
		
		function generarDesglosePuertaPeatonal(alturaTotalPuertaPeatonal, anchuraTotalPuertaPeatonal, holguraPuertaPeatonal, tipo, largueroPuertaPeatonal, modelo, marcoSuperiorPuertaPeatonal){
			console.log('--> generarDesglosePuertaPeatonal');
			var ancho = parseInt(anchuraTotalPuertaPeatonal,10);
			var alto = parseInt(alturaTotalPuertaPeatonal,10);
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
			if(marcoSuperiorPuertaPeatonal==='0'){//SI
				var holguraLargeroSuperior =  parseInt('6', 10);
				if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
					lama = parseInt('200', 10);
				}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 100mm*/
					lama = parseInt('100', 10);
				}else if(modelo==='3'){/*Modelo INOX 21.6cm - 216mm*/ 
					lama = parseInt('216', 10);
				}else if(modelo==='4'){/*Modelo VENECIANA 9.5cm - 95mm*/ 
					lama = parseInt('95', 10);
				}
				if(largueroPuertaPeatonal==='0'){
					perfilPuerta = parseInt('50', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;					
				}else{
					perfilPuerta = parseInt('80', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;
				}
				medidaAlturaInterior = alto - holguraPuertaPeatonal - holguraLargeroSuperior - perfilPuerta;
				
				numeroDeLamas = (medidaAlturaInterior-holguraLamasVertical) / lama;
				lamaRestante = (medidaAlturaInterior-holguraLamasVertical) - (Math.trunc(numeroDeLamas)*lama);
				
				if(modelo==='4'){/*Modelo VENECIANA 9.5cm - 95mm*/ 
					holguraLamasHorizontal = parseInt('6', 10);
				}	
				
				// append some text
				sb+=getCabeceraTabla();
				sb+="<tbody>";
				
					// pintamos los largueros laterales
					if(largueroPuertaPeatonal==='0'){
						sb+=getLineaAdicionalLarguero50x50yAngulo45y90("Larguero Vertical 50x50 con pestaña con corte recto e inglete 45º", "2", alto);
						sb+=getLineaAdicionalLarguero50x50yAngulo45("Larguero Vertical 50x50 con pestaña con corte recto inglete 45º Contrario", "1", ancho);
						if(modelo==='4'){
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Horizontal 50x50 con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Vertical 50x50 con corte inglete troquelado 45º Contrario", "2", medidaAlturaInterior);
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
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Horizontal 50x50 con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Vertical 50x50 con corte inglete troquelado 45º Contrario", "2", medidaAlturaInterior);
						} else if(modelo==='3'){
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
					}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 100mm*/
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
								
				sb+="</tbody>";
				sb+="</table>";
			}else{//NO
				
				if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
					lama = parseInt('200', 10);
				}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 200mm*/
					lama = parseInt('100', 10);
				}else if(modelo==='3'){/*Modelo INOX 21.6cm - 216mm*/ 
					lama = parseInt('216', 10);
				}
				if(largueroPuertaPeatonal==='0'){
					perfilPuerta = parseInt('50', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;					
				}else{
					perfilPuerta = parseInt('80', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;
				}
					
				medidaAlturaInterior = alto - holguraPuertaPeatonal ;
				numeroDeLamas = (medidaAlturaInterior-holguraLamasVertical) / lama;
				lamaRestante = (medidaAlturaInterior-holguraLamasVertical) - (Math.trunc(numeroDeLamas)*lama);
				
				
				// append some text
				sb+=getCabeceraTabla();
				sb+="<tbody>";
				
					// pintamos los largueros laterales
					if(largueroPuertaPeatonal==='0'){
						sb+=getLineaAdicionalLarguero50x50yAngulo90("Larguero Vertical 50x50 con pestaña con corte recto", "2", alto);
						if(modelo==='4'){
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else if(modelo==='3'){
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical Inox 100x50 con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else{
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}	
					}else{
						sb+=getLineaAdicionalLarguero50x80yAngulo90("Larguero Vertical 50x80 con pestaña con corte recto", "2", alto);
						if(modelo==='4'){
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAnchoInterior);
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAlturaInterior);
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
													
				sb+="</tbody>";
				sb+="</table>";
			}	
			
			$("#desglose").html(sb);
		}