/*funcion para comprobar los parametros del formulario para la valla*/
function comprobarFormularioValla() {
	/*Recogemos el valor de los parametros de su formulario y los pasamos a variables*/
	var alturaTotalValla=$('#alturaTotalValla').val();
	var anchuraTotalValla=$('#anchuraTotalValla').val();
	var distribuidor = $('#distribuidor').val();
	var presupuesto = $('#presupuesto').val();
	var fecha = $('#fecha').val();
	var modelo = $('#modelo').val();
	var tipo = $('#tipoPuerta').val();
	var color = $('#color').val();
	var observaciones = $('#observaciones').val();
	
	$(".campo_distribuidor").text(distribuidor);
	$(".campo_num_presupuesto").text(presupuesto);
	$(".campo_fecha").text(fecha);
	$(".campo_alto").text(anchuraTotalValla);
	$(".campo_ancho").text(alturaTotalValla);
	
	
	
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
	
	if(alturaTotalValla.length > 0 && anchuraTotalValla.length > 0){
		if(!isNaN(alturaTotalValla) && !isNaN(anchuraTotalValla)){
			console.log('entra al log');
			$('#capaMedidasValla').show();
			$('#advertenciaValla').hide();
			$('#submitFormularioValla').hide();
			$('#formularioValla').show();
			$('#alturaTotalValla').prop('disabled', true);
			$('#anchuraTotalValla').prop('disabled', true);
			$('#desglosePuertaPeatonal').show();
			$('#peatonal').hide();
			$('#vallas').show();
			$('#abatible_una').hide();
			$('#abatible_dos').hide();
			$('#corredera').hide();
			$(".campo_observaciones").text(observaciones);
			generarDesgloseValla(alturaTotalValla, anchuraTotalValla, modelo);
		}
	}else{
		$('#capaMedidasValla').hide();
		$('#advertenciaValla').show();
	}
}

function generarDesgloseValla(alturaTotalValla, anchuraTotalValla, modelo){
	var ancho = parseInt(anchuraTotalValla,10);
	var alto = parseInt(alturaTotalValla,10);
	var lama;
	var medidaAnchoInterior;
	var medidaAlturaInterior;
	var numeroDeLamas;
	var lamaRestante;
	var holguraLamasVertical = parseInt('125', 10);
	var holguraLamasHorizontal = parseInt('125', 10);
	var sb = "";
	
		
	if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
		lama = parseInt('200', 10);
	}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 200mm*/
		lama = parseInt('100', 10);
	}else if(modelo==='3'){/*Modelo INOX 21.6cm - 216mm*/ 
		lama = parseInt('216', 10);
	}else if(modelo==='4'){/*Modelo VENECIANA 9.5cm - 95mm*/ 
		lama = parseInt('95', 10);
		holguraLamasHorizontal = parseInt('6', 10);
	}
	
	medidaAnchoInterior = ancho - (holguraLamasHorizontal);
	
		
	medidaAlturaInterior = alto - (holguraLamasVertical);
	numeroDeLamas = medidaAlturaInterior / lama;
	lamaRestante = medidaAlturaInterior - (Math.trunc(numeroDeLamas)*lama);
	
	
	// append some text
	sb+=getCabeceraTabla();
	sb+="<tbody>";
	
		// pintamos los largueros laterales
		if(modelo==='4'){
			sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Horizontal 50x50 con corte inglete 45º Contrario", "2", ancho);
			sb+=getLineaAdicionalLarguero50x50Veneciana("Marco Vertical 50x50 con corte inglete troquelado 45º Contrario", "2", alto);
		}else if(modelo==='3'){
			sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", "2", alto);
			sb+=getLineaAdicionalLarguero50x80yAngulo45Inox("Marco Vertical Inox 100x50 con corte inglete 45º Contrario", "2", ancho);
		}else{
			sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", "2", alto);
			sb+=getLineaAdicionalLarguero50x80yAngulo45("Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", "2", ancho);
		}
		
		if(modelo==='0'){/*Modelo PREMIUM 20cm - 200mm*/
			// lamas
			sb+=getLineaAdicionalLamayAngulo90("Lama 200x20 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior));
			if(lamaRestante>0){
				sb+=getLineaAdicionalLamayAngulo90("Lama adicional Lama 200x20 corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior));
			}
		}else if(modelo==='1'){/*Modelo CLASSIC 10cm - 200mm*/
			// lamas
			sb+=getLineaAdicionalLama100yAngulo90("Lama 100x20 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior));
			if(lamaRestante>0){
				sb+=getLineaAdicionalLama100yAngulo90("Lama adicional Lama 100x20 corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior));
			}
		}else if(modelo==='3'){/*Modelo INOX 21,6 cm - 216mm*/
			sb+=getLineaAdicionalLamayAngulo90Inox("Lama 200x26 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-parseInt('35', 10)));
			if(lamaRestante>0){
				sb+=getLineaAdicionalLamayAngulo90Inox("Lama adicional Lama 200x26 corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior-parseInt('35', 10)));
			}
			sb+=getLineaAdicionalTuboInoxidable("Tubo Inoxidable 60x20 corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior-parseInt('35', 10)));
		}else if(modelo==='4'){/*Modelo VENECIANA 9,5cm - 95mm*/
			// lamas
			sb+=getLineaAdicionalLamaAvion125("Lama 100 Avión corte recto", Math.trunc(numeroDeLamas), (medidaAnchoInterior));
			if(lamaRestante>0){
				sb+=getLineaAdicionalLamaAvion125("Lama adicional Lama 100 Avión corte recto", "1", lamaRestante+"mm X "+(medidaAnchoInterior));
			}
		}
					
	sb+="</tbody>";
	sb+="</table>";


	$("#desglose").html(sb);
	}