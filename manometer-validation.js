$(document).ready(function(){
    
    //validate applicant details and sample details are entered
    function validateSampleDetails(){
        var applicantName = $("#applicantName").val();
        var manometerBrandName = $("#manometerBrandName").val();
        var batchValueFirstPart = $("#batchValueFirstPart").val();
        var batchValueSecondPart = $("#batchValueSecondPart").val();
        var sampleSource = $(".sample-source-checkbox").val();

        //validate applicant name
        if(applicantName === undefined || applicantName === null || applicantName === ""){
            $(".notification-box").text("Please enter the applicant name");
            $(".notification-box").removeClass("d-none");
            return false;
        }

        //validate nanometer brand name
        if(manometerBrandName === undefined || manometerBrandName === null || manometerBrandName === ""){
            $(".notification-box").text("Please enter the nanometer brand name");
            $(".notification-box").removeClass("d-none");
            return false;
        }

        //check sample source is selected
        if($('.sample-source-section input[type="checkbox"]:checked').length < 1) {
            $(".notification-box").text("Please select the sample source");
            $(".notification-box").removeClass("d-none");
            return false;
        }

        return true;
    }

    //validate all the visual test details are filled
    function validateVisualTestDetails(){
        var manoMeterType = $("input[name='manoMeterType']:checked").val();
        var defected = $("input[name='defected']:checked").val();
        var pressureReducingValve = $("input[name='pressureReducingValve']:checked").val();
        var verficationMethod = $("input[name='verficationMethod']:checked").val();
        var sampleSize = $("#sampleSize").val();

        //validate manometer type
        if(manoMeterType === undefined){
            $(".notification-box").text("Please select the Manometer type");
            $(".notification-box").removeClass("d-none");
            return false;
        }

        //validate defected 
        if(defected === undefined){
            $(".notification-box").text("Please select the defected option");
            $(".notification-box").removeClass("d-none");
            return false;
        }

        //validate pressure reducing valve
        if(pressureReducingValve === undefined){
            $(".notification-box").text("Please select the Pressure reducing valve condition");
            $(".notification-box").removeClass("d-none");
            return false;
        }

        //validate sample size 
        if(sampleSize === undefined || sampleSize === null || sampleSize === ""){
            $(".notification-box").text("Please enter the sample size");
            $(".notification-box").removeClass("d-none");
            return false;
        }

        //validate verification verficationMethod
        if(verficationMethod === undefined){
            $(".notification-box").text("Please select the verification type");
            $(".notification-box").removeClass("d-none");
            return false;
        }

        return true;
    }

    //check atleast one sample number is entered to proceed
    function checkSampleNumbers(){
        var sampleNumbers = [];
        $(".sample-number-row td input").each(function(){
            var _sampleValue = $.trim($(this).val());
            if(_sampleValue !== undefined && _sampleValue !== null && _sampleValue !== ""){
                sampleNumbers.push(_sampleValue);
            }            
        });

        if(sampleNumbers.length < 1){
            $(".notification-box").text("Please enter the sample number to proceed");
            $(".notification-box").removeClass("d-none");
            return false;
        }
        return true;
    }

    //validate the input field values
    function validateInput(value){
        if(value !== null && value !== undefined && value !== "" && !isNaN(value)){
            return parseFloat(value);
        }
        return null;
    }

    //calculate and find the result = fail/pass
    function checkResult(key, verificationType, values){
        if(
            key === undefined || key === null || key === "" || 
            verificationType === undefined || verificationType === null || verificationType === ""
        ){
            return false;
        }
        
        var threashodLimit = verificationType == "initial" ? 3 : 4;
        var _status = true;
        $($(".result-status-row").find("td")[key+1]).find("input").val('');
        $($(".result-status-row").find("td")[key+1]).find("input").removeClass('failed-status');
        $($(".result-status-row").find("td")[key+1]).find("input").removeClass('passed-status');
        //checking if any value goes out of the limit
        if(
            (values["mmHgValue_0"] < -threashodLimit || values["mmHgValue_0"] > threashodLimit) || 
            (values["mmHgValue_50"] < -threashodLimit || values["mmHgValue_50"] > threashodLimit) || 
            (values["mmHgValue_100"] < -threashodLimit || values["mmHgValue_100"] > threashodLimit) || 
            (values["mmHgValue_150"] < -threashodLimit || values["mmHgValue_150"] > threashodLimit) || 
            (values["mmHgValue_200"] < -threashodLimit || values["mmHgValue_200"] > threashodLimit) || 
            (values["mmHgValue_250"] < -threashodLimit || values["mmHgValue_250"] > threashodLimit) 
        ){
            _status = false;
            $($(".result-status-row").find("td")[key+1]).find("input").val('Fail');
            $($(".result-status-row").find("td")[key+1]).find("input").addClass('failed-status');
            return false;
        }

        //checking if any air leakage values are entered - if yes fail otherwise pass
        if(
            values["prr_p100_1"] !== null || values["prr_p100_2"] !== null || values["prr_p100_3"] !== null ||
             values["prr_p250_1"] !== null || values["prr_p250_2"] !== null || values["prr_p250_3"] !== null
        ){
            _status = false;
            $($(".result-status-row").find("td")[key+1]).find("input").val('Fail');
            $($(".result-status-row").find("td")[key+1]).find("input").addClass('failed-status');
            return false;
        }

        
        if(_status){
            $($(".result-status-row").find("td")[key+1]).find("input").val('Pass');
            $($(".result-status-row").find("td")[key+1]).find("input").addClass('passed-status');
            return true;
        }
    }

    $(".check-result").click(function(){
        
        if(!validateSampleDetails()){
            return false;
        }

        if(!validateVisualTestDetails()){
            return false;
        }

        if(!checkSampleNumbers()){
            return false;
        }

        //hiding the notification bar since the form is validated
        $(".notification-box").text("Please select the verification type");
        if(!$(".notification-box").hasClass("d-none")){
            $(".notification-box").addClass("d-none")
        }

        //starting the calculations
        var verficationMethod = $("input[name='verficationMethod']:checked").val();
        $(".sample-number-row td input").each(function(key){
            var _input = $(this);
            var _sampleValue = _input.val();
            var _key = key;
            if(_sampleValue !== undefined && _sampleValue !== null && _sampleValue !== ""){
                //mmHg values
                var mmHgValue_0 = validateInput($($(".0-mmhg-row").find("td")[_key+1]).find("input").val());
                var mmHgValue_50 = validateInput($($(".50-mmhg-row").find("td")[_key+1]).find("input").val());
                var mmHgValue_100 = validateInput($($(".100-mmhg-row").find("td")[_key+1]).find("input").val());
                var mmHgValue_150 = validateInput($($(".150-mmhg-row").find("td")[_key+1]).find("input").val());
                var mmHgValue_200 = validateInput($($(".200-mmhg-row").find("td")[_key+1]).find("input").val());
                var mmHgValue_250 = validateInput($($(".250-mmhg-row").find("td")[_key+1]).find("input").val());
                //Pressure reduction rate values
                var prr_p100_1 = validateInput($($(".prr-p100-row-1").find("td")[_key+2]).find("input").val());
                var prr_p100_2 = validateInput($($(".prr-p100-row-2").find("td")[_key]).find("input").val());
                var prr_p100_3 = validateInput($($(".prr-p100-row-3").find("td")[_key]).find("input").val());
                var prr_p250_1 = validateInput($($(".prr-p250-row-1").find("td")[_key+1]).find("input").val());
                var prr_p250_2 = validateInput($($(".prr-p250-row-2").find("td")[_key]).find("input").val());
                var prr_p250_3 = validateInput($($(".prr-p250-row-3").find("td")[_key]).find("input").val());

                //check all mmHg values are filled.
                if(mmHgValue_0 === null || mmHgValue_50 === null || mmHgValue_100 === null || mmHgValue_150 === null || mmHgValue_200 === null || mmHgValue_250 === null){
                    $(".notification-box").text("Please enter all the error values");
                    $(".notification-box").removeClass("d-none");
                    return false
                }

                //creating array from all the values
                var _values = {
                    "mmHgValue_0" : mmHgValue_0,
                    "mmHgValue_50" : mmHgValue_50,
                    "mmHgValue_100" : mmHgValue_100,
                    "mmHgValue_150" : mmHgValue_150,
                    "mmHgValue_200" : mmHgValue_200,
                    "mmHgValue_250" : mmHgValue_250,
                    "prr_p100_1" : prr_p100_1,
                    "prr_p100_2" : prr_p100_2,
                    "prr_p100_3" : prr_p100_3,
                    "prr_p250_1" : prr_p250_1,
                    "prr_p250_2" : prr_p250_2,
                    "prr_p250_3" : prr_p250_3
                }

                //calculating and deciding result is a pass or fail
                var _result = checkResult(_key, verficationMethod, _values);
            }
        });
    })
})
