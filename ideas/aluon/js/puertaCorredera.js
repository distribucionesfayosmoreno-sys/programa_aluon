/*funcion para comprobar los parametros del formulario para la puerta abatible de dos hojas hoja*/
		function comprobarFormularioPuertaCorredera() {
			/*Recogemos el valor de los parametros de su formulario y los pasamos a variables*/
			var distribuidor = $('#distribuidor').val();
			var presupuesto = $('#presupuesto').val();
			var fecha = $('#fecha').val();
			var modelo = $('#modelo').val();
			var tipo = $('#tipoPuerta').val();
			var color = $('#color').val();
			var alturaTotalPuertaCorredera=$('#alturaTotalPuertaCorredera').val();
			var anchuraTotalPuertaCorredera=$('#anchuraTotalPuertaCorredera').val();
			var automatizacionPuertaCorredera=$('#automatizacionPuertaCorredera').val();
			var refuerzoAutomatizacionPuertaCorredera=$('#refuerzoAutomatizacionPuertaCorredera').val();
			var aperturaPuertaCorredera=$('#aperturaPuertaCorredera').val();
			var carrilPuertaCorredera=$('#carrilPuertaCorredera').val();
			var montajePuertaCorredera=$('#montajePuertaCorredera').val();
			var colaPuertaCorredera=$('#colaPuertaCorredera').val();
			
			if(montajePuertaCorredera==="1"){
				$(".campo_montaje_B").text('X');
			}else if(montajePuertaCorredera==="0"){
				$(".campo_montaje_A").text('X');
			}
			
			$(".campo_distribuidor").text(distribuidor);
			$(".campo_num_presupuesto").text(presupuesto);
			$(".campo_fecha").text(fecha);
			$(".campo_altura").text(alturaTotalPuertaCorredera);
			$(".campo_anchura_izq").text(anchuraTotalPuertaCorredera);
			$(".campo_anchura_der").text(anchuraTotalPuertaCorredera);
			
			
			
			if(modelo==='0'){
				$(".campo_modelo").text("ALUON PREMIUM");
			}else if(modelo==='1'){
				$(".campo_modelo").text("ALUON CLASSIC");
			}else if(modelo==='2'){
				$(".campo_modelo").text("ALUON BISEL");
			}else if(modelo==='3'){
				$(".campo_modelo").text("ALUON INOX");
			}
			
			
			if(automatizacionPuertaCorredera==="1"){
				$(".campo_automatizacion_no").text('X');
			}else if(automatizacionPuertaCorredera==="0"){
				$(".campo_automatizacion_si").text('X');
			}
			
			if(refuerzoAutomatizacionPuertaCorredera==="1"){
				$(".campo_observaciones").text('NOTA: NO lleva refuerzo automatización');
			}else if(refuerzoAutomatizacionPuertaCorredera==="0"){
				$(".campo_observaciones").text('NOTA: LLeva refuerzo automatización');
			}
			
			if(carrilPuertaCorredera==="1"){
				$(".campo_carril_20").text('X');
			}else if(carrilPuertaCorredera==="0"){
				$(".campo_carril_16").text('X');
			}
			
			if(aperturaPuertaCorredera==="1"){
				$(".campo_apertura_der").text('X');
			}else if(aperturaPuertaCorredera==="0"){
				$(".campo_apertura_izq").text('X');
			}
			
			$(".campo_acabado").text(tipo);
			$(".campo_color").text(color);
						
								
			if(alturaTotalPuertaCorredera.length > 0 && anchuraTotalPuertaCorredera.length > 0 && automatizacionPuertaCorredera >= 0 && refuerzoAutomatizacionPuertaCorredera >= 0 && aperturaPuertaCorredera >= 0 && carrilPuertaCorredera >= 0 && montajePuertaCorredera >= 0){
				if(!isNaN(alturaTotalPuertaCorredera) && !isNaN(anchuraTotalPuertaCorredera)){
					console.log('entra al log');
					$('#capaMedidasPuertaCorredera').show();
					$('#advertenciaPuertaCorredera').hide();
					$('#submitFormularioPuertaCorredera').hide();
					$('#formularioPuertaCorredera').show();
					$('#alturaTotalPuertaCorredera').prop('disabled', true);
					$('#anchuraTotalPuertaCorredera').prop('disabled', true);
					$('#automatizacionPuertaCorredera').prop('disabled', true);
					$('#refuerzoAutomatizacionPuertaCorredera').prop('disabled', true);
					$('#aperturaPuertaCorredera').prop('disabled', true);
					$('#carrilPuertaCorredera').prop('disabled', true);
					$('#montajePuertaCorredera').prop('disabled', true);
					$('#desglosePuertaPeatonal').show();
					$('#peatonal').hide();
					$('#vallas').hide();
					$('#abatible_una').hide();
					$('#abatible_dos').hide();
					$('#corredera').show();
					generarDesglosePuertaCorredera(alturaTotalPuertaCorredera, anchuraTotalPuertaCorredera, refuerzoAutomatizacionPuertaCorredera, carrilPuertaCorredera, colaPuertaCorredera, modelo, montajePuertaCorredera);
				}
			}else{
				$('#capaMedidasPuertaCorredera').hide();
				$('#advertenciaPuertaCorredera').show();
			}	
		}
		
		function generarDesglosePuertaCorredera(alturaTotalPuertaCorredera, anchuraTotalPuertaCorredera, refuerzoAutomatizacionPuertaCorredera, carrilPuertaCorredera, colaPuertaCorredera, modelo, montajePuertaCorredera){
			var ancho = parseInt(anchuraTotalPuertaCorredera,10);
			var alto = parseInt(alturaTotalPuertaCorredera,10);
			var lama;
			var perfil;
			var marcoSuperior;
			var marcoInferior;
			var marcoCierre;
			var marcoPosterior;
			var medidaAnchoInterior;
			var medidaAlturaInterior;
			var carril;
			var numeroDeLamas;
			var lamaRestante;
			var sb = "";
			var holguraLamasVertical = parseInt('125', 10);
			var holguraLamasHorizontal = parseInt('125', 10);
			var restaRefuerzoMotor = parseInt('160', 10);
			
			if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
				lama = parseInt('200', 10);
				perfil = parseInt('80', 10);
			}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 200mm*/
				lama = parseInt('100', 10);
				perfil = parseInt('100', 10);
			}else if(modelo==='3'){/*Modelo INOX 21.6cm - 216mm*/
				lama = parseInt('216', 10);
				perfil = parseInt('100', 10);
			}else if(modelo==='4'){/*Modelo VENECIANA 9.5cm - 95mm*/ 
				lama = parseInt('95', 10);
				holguraLamasHorizontal = parseInt('6', 10);
				restaRefuerzoMotor = parseInt('6', 10);
			}
			
			if(colaPuertaCorredera===0){//SI
				marcoSuperior = ancho+250;
				marcoInferior = ancho+250;
				if(carrilPuertaCorredera==='0'){
					carril = parseInt('35', 10);
				}else{
					carril = parseInt('40', 10);
				}
				marcoCierre = alto-carril;
				marcoPosterior = marcoCierre-80;
			}else{//NO
				marcoSuperior = ancho+250;
				marcoInferior = ancho;
				if(carrilPuertaCorredera==='0'){
					carril = parseInt('35', 10);
				}else{
					carril = parseInt('40', 10);
				}
				marcoCierre = alto-carril;
				marcoPosterior = marcoCierre-160;
			}
			
			if(modelo==='3'){
				medidaAnchoInterior=ancho-160;
				medidaAlturaInterior=alto-160;
			}else if(modelo==='4'){
				medidaAnchoInterior=ancho-6;
				medidaAlturaInterior=alto-100;
			}else{
				medidaAnchoInterior=ancho-125;
				medidaAlturaInterior=alto-125;
			}
			
			
			numeroDeLamas = (medidaAlturaInterior-carril)/lama;
			lamaRestante = (medidaAlturaInterior-carril)-(Math.trunc(numeroDeLamas)*lama);
			
			sb+=getCabeceraTabla();
			sb+="<tbody>";
			if(modelo==='4'){
				sb+=getLineaAdicionalLarguero50x50VenecianaCorredera("Marco Superior 50x50", "1", marcoSuperior);
				sb+=getLineaAdicionalLarguero50x50VenecianaCorredera("Marco de cierre 50x50 Ranura", "1", marcoCierre);
			}else if(modelo==='3'){
				sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", "2", ancho);
				sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical Inox 100x50 con corte inglete 45º Contrario", "2", marcoCierre);
				sb+=getLineaAdicionalTubo80x50yAngulo90("Cola Superior 80x50 con corte recto 90º", "1", "250");
			}else{
				sb+=getLineaAdicionalLarguero50x80yAngulo45y90Ranura("Marco Superior 80x50 Ranura", "1", marcoSuperior);
				sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco de cierre 80x50 Ranura", "1", marcoCierre);
			}	
			
			if(colaPuertaCorredera==='0'){//SI
				
				if(modelo==='4'){
					sb+=getLineaAdicionalLarguero50x50VenecianaCorredera("Marco Inferior 50x50 Ranura", "1", marcoSuperior);
					sb+=getLineaAdicionalLarguero50x50VenecianaCorredera("Marco Posterior 50x50 Ranura", "1", marcoPosterior);
				}else if(modelo==='3'){
					sb+=getLineaAdicionalTubo80x50yAngulo90("Cola Motor 80x50 con corte recto 90º", "1", "250");
				}else{
					sb+=getLineaAdicionalLarguero50x80yAngulo45y90Ranura("Marco Inferior 80x50 Ranura", "1", marcoSuperior);
					sb+=getLineaAdicionalLarguero50x80yAngulo90Ranura("Marco Posterior 80x50 Ranura", "1", marcoPosterior);
				}
				
			}else{//NO
				if(modelo==='3'){
				}else{
					sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Inferior 80x50 Inglete Contrario", "1", (marcoSuperior-250));
					sb+=getLineaAdicionalLarguero50x80yAngulo45y90Ranura("Marco Posterior 80x50 Ranura Inglete Contrario", "1", (marcoCierre-80));
				}
			}
			sb+=getLineaAdicionalperfilRuedasCorrederayAngulo90("Perfil Ruedas Correderas Corte Recto", "1", (marcoSuperior-5));
			if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
				// lamas
				sb+=getLineaAdicionalLamayAngulo90("Lama 200x20 corte recto", Math.trunc(numeroDeLamas), medidaAnchoInterior);
				if(lamaRestante>0){
					sb+=getLineaAdicionalLamayAngulo90("Lama adicional Lama 200x20 corte recto", "1", lamaRestante+"mm X "+medidaAnchoInterior);
				}
			}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 200mm*/
				// lamas
				sb+=getLineaAdicionalLama100yAngulo90("Lama 100x20 corte recto", Math.trunc(numeroDeLamas), medidaAnchoInterior);
				if(lamaRestante>0){
					sb+=getLineaAdicionalLama100yAngulo90("Lama adicional Lama 100x20 corte recto", "1", lamaRestante+"mm X "+medidaAnchoInterior);
				}
			}else if(modelo==='3'){/*Modelo INOX 21,6 cm - 216mm*/
				sb+=getLineaAdicionalLamayAngulo90Inox("Lama 200x26 corte recto", Math.trunc(numeroDeLamas), (ancho-parseInt('160', 10)));
				if(lamaRestante>0){
					sb+=getLineaAdicionalLamayAngulo90Inox("Lama adicional Lama 200x26 corte recto", "1", lamaRestante+"mm X "+(ancho-parseInt('160', 10)));
				}
				sb+=getLineaAdicionalTuboInoxidable("Tubo Inoxidable 60x20 corte recto", Math.trunc(numeroDeLamas), (ancho-parseInt('160', 10)));
			}else if(modelo==='4'){/*Modelo VENECIANA 9,5cm - 95mm*/
				// lamas
				sb+=getLineaAdicionalLamaAvion125("Lama 100 Avión corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior));
				if(lamaRestante>0){
					sb+=getLineaAdicionalLamaAvion125("Lama adicional Lama 100 Avión corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior));
				}
			}
			if(montajePuertaCorredera==='0'){//Montaje A
				sb+=getLineaAdicionalposteDeCierrePuertaCorrederaMontajeA("Poste de cierre sin pestañas", "1", (alto));
			}else if(montajePuertaCorredera==='1'){//Montaje B
				sb+=getLineaAdicionalposteDeCierrePuertaCorrederaMontajeB("Poste de cierre con pestañas", "1", (alto));
			}
			if(refuerzoAutomatizacionPuertaCorredera==='0'){
				if(modelo==='3'){
					sb+=getRefuerzoMotorInox("Tubo 50x50 Refuerzo Motor Inoxidable", "1", (ancho+parseInt('310', 10)));
				}else{
					sb+=getRefuerzoMotor("Tubo 40x15 Refuerzo Motor", "1", (medidaAnchoInterior-restaRefuerzoMotor));
				}
			}	
			sb+="</tbody>";
			sb+="</table>";
			
			$("#desglose").html(sb);
		}			