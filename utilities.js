// U T I L  F U N C S
	var pc = (a, b) => {
	    if (a === b) return 0; // avoid any floating point crazyness
	    return (100 - (b / (a / 100))) * -1;
	}
	var changeByXPercent = (targ, perc) => (((perc / 100) + 1) * targ);
	var avcan = (array, includeCurrentCandle = false, onlyUpperRange = false) => {
	    const lowIndex = onlyUpperRange ? 1 : 3;
	    const ranges = array.map(c => {
	        return pc(parseFloat(c[lowIndex]), parseFloat(c[2]))
	    });
	    const rangesNew = includeCurrentCandle ? ranges : ranges.slice(0, ranges.length - 1);
	    return rangesNew.reduce((a, b) => a + b, 0) / ranges.length
	}

	class MovAvg {
	    constructor(interval) {
	        this.interval = interval;
	        this.priceHistory = [];
	        this.valueHistory = [];
	    }

	    addNewPrice(price) {
	        this.priceHistory.push(price);
	        if (this.priceHistory.length < this.interval) return;
	        const slicedRange = this.priceHistory.slice(this.priceHistory.length - this.interval, this.priceHistory.length);
	        const currentAvg = slicedRange.reduce((a, cv) => a + cv) / slicedRange.length
	        this.valueHistory.push(currentAvg);
	    }

	    mostRecentValue(num = 1) {
	        if (num > this.valueHistory.length) {
	            return this.valueHistory;
	        }
	        const lastIndex = this.valueHistory.length;
	        return this.valueHistory.slice(lastIndex - num, lastIndex);
	    }

	    mostRecentChange() {
	        if (this.valueHistory < 2) return 0;
	        const r = this.mostRecentValue(2);
	        return pc(r[0], r[1]);
	    }
	}

	const beep = () => {
	    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
	    snd.play();
	}

	const averageCandleSize = (candles, includeWick = false) => {
		const range = includeWick ? {a: 2, b: 3}: {a: 1, b: 4};
		const percentChangesCombined = candles.reduce((accumulator, candle) => accumulator + Math.abs(pc(parseFloat(candle[range.a]), parseFloat(candle[range.b]))), 0)
	    return percentChangesCombined / candles.length;
	}

	const drawChart = (chartData, markers, volumeData, smaData, smaSecondData, theChartId = "theChart") => {
		//https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ISeriesApi
		//https://tradingview.github.io/lightweight-charts/docs/api/interfaces/CandlestickData
		document.querySelector("#" + theChartId).innerHTML = "";

		// chart config
		var chart = LightweightCharts.createChart(theChartId, {
		    width: 1400,
		    height: 700,
		    layout: {
		        background: {
		            type: 'solid',
		            color: '#000000',
		        },
		        textColor: 'rgba(0, 155, 0, 0.75)',
		    },
		    grid: {
		        vertLines: {
		            color: 'rgba(0, 155, 0, 0.25)',
		        },
		        horzLines: {
		            color: 'rgba(0, 155, 0, 0.25)',
		        },
		    },
		    crosshair: {
		        mode: LightweightCharts.CrosshairMode.Normal,
		    },
		    rightPriceScale: {
		        borderColor: 'rgba(197, 203, 206, 0.8)',
		    },
		    timeScale: {
		        borderColor: 'rgba(197, 203, 206, 0.8)',
		        timeVisible: true,
		    },
		});

		// condlestick series
		var candleSeries = chart.addCandlestickSeries({
			upColor: 'rgba(0, 155, 0, 1)',
			downColor: 'rgba(155, 0, 0, 1)',
			borderDownColor: 'rgba(155, 0, 0, 0.5)',
			borderUpColor: 'rgba(0, 155, 0, 0.5)',
			wickDownColor: 'rgba(155, 0, 0, 1)',
			wickUpColor: 'rgba(0, 155, 0, 1)',
		});

		candleSeries.setData(chartData);

		if(markers){
			candleSeries.setMarkers(markers);			
		}

		if(volumeData){
			// volume series
			const volumeSeries = chart.addHistogramSeries({
				color: '#26a69a',
				priceFormat: {
					type: 'volume',
				},
				priceScaleId: '', // set as an overlay by setting a blank priceScaleId
				// set the positioning of the volume series
				scaleMargins: {
					top: 0.7, // highest point of the series will be 70% away from the top
					bottom: 0,
				},
			});
			volumeSeries.priceScale().applyOptions({
				scaleMargins: {
					top: 0.7, // highest point of the series will be 70% away from the top
					bottom: 0,
				},
			})
			volumeSeries.setData(volumeData);

		}

		if(smaData) {
			// SMA series
			const smaSeries = chart.addLineSeries({
				color: '#2962FF',
				lineWidth: 2,
				// disabling built-in price lines
				lastValueVisible: false,
				priceLineVisible: false,
			});
			smaSeries.setData(smaData);
		}

		// SMA optional second series
		if(smaSecondData) {
			const smaSecondSeries = chart.addLineSeries({
				color: 'orange',
				lineWidth: 2,
				// disabling built-in price lines
				lastValueVisible: false,
				priceLineVisible: false,
			});
			smaSecondSeries.setData(smaSecondData);
		}

		chart.timeScale().fitContent();
	}

	// U T I L   F U N C S   E N D
