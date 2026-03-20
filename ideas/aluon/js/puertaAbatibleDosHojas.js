/*funcion para comprobar los parametros del formulario para la puerta abatible de dos hojas hoja*/
		function comprobarFormularioPuertaAbatibleDosHojas() {
			/*Recogemos el valor de los parametros de su formulario y los pasamos a variables*/
			var distribuidor = $('#distribuidor').val();
			var presupuesto = $('#presupuesto').val();
			var fecha = $('#fecha').val();
			var modelo = $('#modelo').val();
			var tipo = $('#tipoPuerta').val();
			var color = $('#color').val();
			var alturaTotalPuertaAbatibleDosHojas=$('#alturaTotalPuertaAbatibleDosHojas').val();
			var anchuraTotalPuertaAbatibleDosHojas=$('#anchuraTotalPuertaAbatibleDosHojas').val();
			var automatizacionPuertaAbatibleDosHojas=$('#automatizacionPuertaAbatibleDosHojas').val();
			var refuerzoAutomatizacionPuertaAbatibleDosHojas=$('#refuerzoAutomatizacionPuertaAbatibleDosHojas').val();	
			var holguraPuertaAbatibleDosHojas=$('#holguraPuertaAbatibleDosHojas').val();
			var bisagrasPuertaAbatibleDosHojas=$('#bisagrasPuertaAbatibleDosHojas').val();
			var largueroPuertaAbatibleDosHojas=$('#largueroPuertaAbatibleDosHojas').val();
			var primeraHojaAperturaPuertaAbatibleDosHojas = $('#primeraHojaAperturaPuertaAbatibleDosHojas').val();
			var marcoSuperiorPuertaAbatibleDosHojas = $('#marcoSuperiorPuertaAbatibleDosHojas').val();
			var observaciones = $('#observaciones').val();
			var automatizacion;
			var bisagras;
			
			
			/*Comprobamos la posicion de las bisagras*/
			if(bisagrasPuertaAbatibleDosHojas==="1"){
				$(".campo_bisagra_der").text('X');
			}else if(bisagrasPuertaAbatibleDosHojas==="0"){
				$(".campo_bisagra_izq").text('X');
			}
			
			
			if(primeraHojaAperturaPuertaAbatibleDosHojas==="1"){
				$(".campo_primera_hoja_der").text('X');
			}else if(primeraHojaAperturaPuertaAbatibleDosHojas==="0"){
				$(".campo_primera_hoja_izq").text('X');
			}
			
			
			if(automatizacionPuertaAbatibleDosHojas==="1"){
				$(".campo_automatizacion_no").text('X');
			}else if(automatizacionPuertaAbatibleDosHojas==="0"){
				$(".campo_automatizacion_si").text('X');
			}
			
			if(refuerzoAutomatizacionPuertaAbatibleDosHojas==="1"){
				$(".campo_observaciones_abatible_dos_hojas").text('NOTA: NO lleva refuerzo automatización');
			}else if(refuerzoAutomatizacionPuertaAbatibleDosHojas==="0"){
				$(".campo_observaciones_abatible_dos_hojas").text('NOTA: LLeva refuerzo automatización');
			}
			
			var memoriaObservaciones = $(".campo_observaciones_abatible_dos_hojas").text();
			
			
			if(marcoSuperiorPuertaAbatibleDosHojas==="1"){
				$(".campo_observaciones_abatible_dos_hojas").text(memoriaObservaciones+'  NO lleva marco superior');
			}else if(marcoSuperiorPuertaAbatibleDosHojas==="0"){
				$(".campo_observaciones_abatible_dos_hojas").text(memoriaObservaciones+' SI lleva marco superior');
			}
			
			$(".campo_altura_izq").text(alturaTotalPuertaAbatibleDosHojas);
			$(".campo_altura_der").text(alturaTotalPuertaAbatibleDosHojas);
			$(".campo_anchura").text(anchuraTotalPuertaAbatibleDosHojas);
			$(".campo_holgura").text(holguraPuertaAbatibleDosHojas);
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

			
			if(alturaTotalPuertaAbatibleDosHojas.length > 0 && anchuraTotalPuertaAbatibleDosHojas.length > 0 && holguraPuertaAbatibleDosHojas.length > 0 && automatizacionPuertaAbatibleDosHojas >= 0 && refuerzoAutomatizacionPuertaAbatibleDosHojas >= 0 && primeraHojaAperturaPuertaAbatibleDosHojas >= 0 && marcoSuperiorPuertaAbatibleDosHojas >= 0){
				if(!isNaN(alturaTotalPuertaAbatibleDosHojas) && !isNaN(anchuraTotalPuertaAbatibleDosHojas) && !isNaN(holguraPuertaAbatibleDosHojas)){
					console.log('entra al log');
					$('#capaMedidasPuertaAbatibleDosHojas').show();
					$('#advertenciaPuertaAbatibleDosHojas').hide();
					$('#submitFormularioPuertaAbatibleDosHojas').hide();
					$('#formularioPuertaAbatibleDosHojas').show();
					$('#alturaTotalPuertaAbatibleDosHojas').prop('disabled', true);
					$('#anchuraTotalPuertaAbatibleDosHojas').prop('disabled', true);
					$('#holguraPuertaAbatibleDosHojas').prop('disabled', true);
					$('#automatizacionPuertaAbatibleDosHojas').prop('disabled', true);
					$('#primeraHojaAperturaPuertaAbatibleDosHojas').prop('disabled', true);
					$('#marcoSuperiorPuertaAbatibleDosHojas').prop('disabled', true);
					$('#refuerzoAutomatizacionPuertaAbatibleDosHojas').prop('disabled', true);
					$('#desglosePuertaPeatonal').show();
					$('#peatonal').hide();
					$('#vallas').hide();
					$('#abatible_una').hide();
					$('#abatible_dos').show();
					$('#corredera').hide();
					generarDesglosePuertaAbatibleDosHojas(alturaTotalPuertaAbatibleDosHojas, anchuraTotalPuertaAbatibleDosHojas, holguraPuertaAbatibleDosHojas, tipo, largueroPuertaAbatibleDosHojas, modelo, marcoSuperiorPuertaAbatibleDosHojas, refuerzoAutomatizacionPuertaAbatibleDosHojas);
				}
			}else{
				$('#capaMedidasPuertaAbatibleDosHojas').hide();
				$('#advertenciaPuertaAbatibleDosHojas').show();
			}
		}
		
		function generarDesglosePuertaAbatibleDosHojas(alturaTotalPuertaAbatibleDosHojas, anchuraTotalPuertaAbatibleDosHojas, holguraPuertaAbatibleDosHojas, tipo, largueroPuertaAbatibleDosHojas, modelo, marcoSuperiorPuertaAbatibleDosHojas, refuerzoAutomatizacionPuertaAbatibleDosHojas){
			console.log('--> generarDesglosePuertaAbatibleDosHojas');
			var ancho = parseInt(anchuraTotalPuertaAbatibleDosHojas,10);
			var alto = parseInt(alturaTotalPuertaAbatibleDosHojas,10);
			var holgura = parseInt('24',10);
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
			if(marcoSuperiorPuertaAbatibleDosHojas==='0'){//SI
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
				if(largueroPuertaAbatibleDosHojas==='0'){
					perfilPuerta = parseInt('50', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;					
				}else{
					perfilPuerta = parseInt('80', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;
				}
				medidaAlturaInterior = alto - holguraPuertaAbatibleDosHojas - holguraLargeroSuperior - perfilPuerta;
				
				numeroDeLamas = (medidaAlturaInterior-holguraLamasVertical) / lama;
				lamaRestante = (medidaAlturaInterior-holguraLamasVertical) - (Math.trunc(numeroDeLamas)*lama);
				
				// append some text
				sb+=getCabeceraTabla();
				sb+="<tbody>";
				
					// pintamos los largueros laterales
					if(largueroPuertaAbatibleDosHojas==='0'){
						sb+=getLineaAdicionalLarguero50x50yAngulo45y90("Larguero Vertical 50x50 con pestaña con corte recto e inglete 45º", "2", alto);
						sb+=getLineaAdicionalLarguero50x50yAngulo45("Larguero Horizontal 50x50 con pestaña con corte recto inglete 45º Contrario", "1", ancho);
						if(modelo==='4'){
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAnchoInterior/2);
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else if(modelo==='3'){
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal 80x50 con corte inglete 45º Contrario", "4", (medidaAnchoInterior/2));
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical 80x50 con corte inglete 45º Contrario", "3", (medidaAlturaInterior));
							sb+=getLineaAdicionalLarguero50x80yAngulo45conPestaniaInox("Marco Vertical 80x50 y pestaña con corte inglete 45º Contrario", "1", (medidaAlturaInterior+40));
						}else{
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", "4", (medidaAnchoInterior/2));
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", "3", (medidaAlturaInterior));
							sb+=getLineaAdicionalLarguero50x80yAngulo45conPestania("Marco Vertical 80x50 con ranura y pestaña con corte inglete 45º Contrario", "1", (medidaAlturaInterior+40));
						}
					}else{
						sb+=getLineaAdicionalLarguero50x80yAngulo45y90("Larguero Vertical 50x80 con pestaña con corte recto e inglete 45º", "2", alto);
						sb+=getLineaAdicionalLarguero50x80yAngulo45Modelo2("Larguero Horizontal 50x80 con pestaña con corte inglete 45º Contrario", "1", ancho);
						if(modelo==='4'){
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAnchoInterior/2);
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else if(modelo==='3'){
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal 80x50 con corte inglete 45º Contrario", "4", (medidaAnchoInterior/2));
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical 80x50 con corte inglete 45º Contrario", "3", (medidaAlturaInterior));
							sb+=getLineaAdicionalLarguero50x80yAngulo45conPestaniaInox("Marco Vertical 80x50 y pestaña con corte inglete 45º Contrario", "1", (medidaAlturaInterior+40));
						}else{
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", "4", (medidaAnchoInterior/2));
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", "3", (medidaAlturaInterior));
							sb+=getLineaAdicionalLarguero50x80yAngulo45conPestania("Marco Vertical 80x50 con ranura y pestaña con corte inglete 45º Contrario", "1", (medidaAlturaInterior+40));
						}
					}
					if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
						// lamas
						sb+=getLineaAdicionalLamayAngulo90("Lama 200x20 corte recto", (Math.trunc(numeroDeLamas)*2), ((medidaAnchoInterior/2)-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamayAngulo90("Lama adicional Lama 200x20 corte recto", "2", lamaRestante+"mm X "+((medidaAnchoInterior/2)-holguraLamasHorizontal));
						}
					}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 200mm*/
						// lamas
						sb+=getLineaAdicionalLama100yAngulo90("Lama 100x20 corte recto", (Math.trunc(numeroDeLamas)*2), ((medidaAnchoInterior/2)-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLama100yAngulo90("Lama adicional Lama 100x20 corte recto", "2", lamaRestante+"mm X "+((medidaAnchoInterior/2)-holguraLamasHorizontal));
						}
					}else if(modelo==='3'){/*Modelo INOX 21,6 cm - 216mm*/
						sb+=getLineaAdicionalLamayAngulo90Inox("Lama 200x26 corte recto", Math.trunc(numeroDeLamas*2), ((medidaAnchoInterior/2)-holguraLamasHorizontal-parseInt('35', 10)));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamayAngulo90Inox("Lama adicional Lama 200x26 corte recto", "2", lamaRestante+"mm X "+((medidaAnchoInterior/2)-holguraLamasHorizontal-parseInt('35', 10)));
						}
						sb+=getLineaAdicionalTuboInoxidable("Tubo Inoxidable 60x20 corte recto", Math.trunc(numeroDeLamas*2), ((medidaAnchoInterior/2)-holguraLamasHorizontal-parseInt('35', 10)));
					}else if(modelo==='4'){/*Modelo VENECIANA 9,5cm - 95mm*/
						// lamas
						sb+=getLineaAdicionalLamaAvion125("Lama 100 Avión corte recto", Math.trunc(numeroDeLamas*2), ((medidaAnchoInterior/2)-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamaAvion125("Lama adicional Lama 100 Avión corte recto", "2", lamaRestante+"mm X "+((medidaAnchoInterior/2)-holguraLamasHorizontal));
						}
					}
					if(refuerzoAutomatizacionPuertaAbatibleDosHojas==='0'){
						if(modelo==='3'){
							sb+=getRefuerzoMotorInox("Tubo 50x50 Refuerzo Motor Inoxidable", "2", ((medidaAnchoInterior/2)+parseInt('80', 10)));
						}else{
							sb+=getRefuerzoMotor("Tubo 40x15 Refuerzo Motor", "2", ((medidaAnchoInterior-(restaRefuerzoMotor*2))/2));
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
				if(largueroPuertaAbatibleDosHojas==='0'){
					perfilPuerta = parseInt('50', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;					
				}else{
					perfilPuerta = parseInt('80', 10);
					medidaAnchoInterior = ancho - (perfilPuerta*2) - holgura;
				}
					
				medidaAlturaInterior = alto - holguraPuertaAbatibleDosHojas ;
				numeroDeLamas = (medidaAlturaInterior-holguraLamasVertical) / lama;
				lamaRestante = (medidaAlturaInterior-holguraLamasVertical) - (Math.trunc(numeroDeLamas)*lama);
				
				
				// append some text
				sb+=getCabeceraTabla();
				sb+="<tbody>";
				
					// pintamos los largueros laterales
					if(largueroPuertaAbatibleDosHojas==='0'){
						sb+=getLineaAdicionalLarguero50x50yAngulo90("Larguero Vertical 50x50 con pestaña con corte recto", "2", alto);
						if(modelo==='4'){
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAnchoInterior/2);
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else if(modelo==='3'){
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal 80x50 con corte inglete 45º Contrario", "4", (medidaAnchoInterior/2));
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical 80x50 con corte inglete 45º Contrario", "3", (medidaAlturaInterior));
							sb+=getLineaAdicionalLarguero50x80yAngulo45conPestaniaInox("Marco Vertical 80x50 y pestaña con corte inglete 45º Contrario", "1", (medidaAlturaInterior+40));
						}else{
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", "4", (medidaAnchoInterior/2));
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", "3", (medidaAlturaInterior));
							sb+=getLineaAdicionalLarguero50x80yAngulo45conPestania("Marco Vertical 80x50 con ranura y pestaña con corte inglete 45º Contrario", "1", (medidaAlturaInterior+40));
						}
					}else{
						sb+=getLineaAdicionalLarguero50x80yAngulo90("Larguero Vertical 50x80 con pestaña con corte recto", "2", alto);
						if(modelo==='4'){
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAnchoInterior/2);
							sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", "2", medidaAlturaInterior);
						}else if(modelo==='3'){
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal 80x50 con corte inglete 45º Contrario", "4", (medidaAnchoInterior/2));
							sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical 80x50 con corte inglete 45º Contrario", "3", (medidaAlturaInterior));
							sb+=getLineaAdicionalLarguero50x80yAngulo45conPestaniaInox("Marco Vertical 80x50 y pestaña con corte inglete 45º Contrario", "1", (medidaAlturaInterior+40));
						}else{
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", "4", (medidaAnchoInterior/2));
							sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", "3", (medidaAlturaInterior));
							sb+=getLineaAdicionalLarguero50x80yAngulo45conPestania("Marco Vertical 80x50 con ranura y pestaña con corte inglete 45º Contrario", "1", (medidaAlturaInterior+40));
						}
					}
					if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
						// lamas
						sb+=getLineaAdicionalLamayAngulo90("Lama 200x20 corte recto", (Math.trunc(numeroDeLamas)*2), ((medidaAnchoInterior/2)-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamayAngulo90("Lama adicional Lama 200x20 corte recto", "2", lamaRestante+"mm X "+((medidaAnchoInterior/2)-holguraLamasHorizontal));
						}
					}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 200mm*/
						// lamas
						sb+=getLineaAdicionalLama100yAngulo90("Lama 100x20 corte recto", (Math.trunc(numeroDeLamas)*2), ((medidaAnchoInterior/2)-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLama100yAngulo90("Lama adicional Lama 100x20 corte recto", "2", lamaRestante+"mm X "+((medidaAnchoInterior/2)-holguraLamasHorizontal));
						}
					}else if(modelo==='3'){/*Modelo INOX 21,6 cm - 216mm*/
						sb+=getLineaAdicionalLamayAngulo90Inox("Lama 200x26 corte recto", Math.trunc(Math.trunc(numeroDeLamas)*2), ((medidaAnchoInterior/2)-holguraLamasHorizontal-parseInt('35', 10)));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamayAngulo90Inox("Lama adicional Lama 200x26 corte recto", "2", lamaRestante+"mm X "+((medidaAnchoInterior/2)-holguraLamasHorizontal-parseInt('35', 10)));
						}
						sb+=getLineaAdicionalTuboInoxidable("Tubo Inoxidable 60x20 corte recto", Math.trunc(numeroDeLamas*2), ((medidaAnchoInterior/2)-holguraLamasHorizontal-parseInt('35', 10)));
					}else if(modelo==='4'){/*Modelo VENECIANA 9,5cm - 95mm*/
						// lamas
						sb+=getLineaAdicionalLamaAvion125("Lama 100 Avión corte recto", Math.trunc(numeroDeLamas*2), ((medidaAnchoInterior/2)-holguraLamasHorizontal));
						if(lamaRestante>0){
							sb+=getLineaAdicionalLamaAvion125("Lama adicional Lama 100 Avión corte recto", "2", lamaRestante+"mm X "+((medidaAnchoInterior/2)-holguraLamasHorizontal));
						}
					}
					if(refuerzoAutomatizacionPuertaAbatibleDosHojas==='0'){
						if(modelo==='3'){
							sb+=getRefuerzoMotorInox("Tubo 50x50 Refuerzo Motor Inoxidable", "2", ((medidaAnchoInterior/2)+parseInt('80', 10)));
						}else{
							sb+=getRefuerzoMotor("Tubo 40x15 Refuerzo Motor", "2", ((medidaAnchoInterior-(restaRefuerzoMotor*2))/2));
						}
					}
				sb+="</tbody>";
				sb+="</table>";
			}	
			
			$("#desglose").html(sb);
		}