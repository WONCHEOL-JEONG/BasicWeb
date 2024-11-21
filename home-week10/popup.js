document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("inputText").value;

    document.getElementById("translationResult").innerHTML = "";

    if (!text) {
        alert("문장을 입력해주세요.");
        return;
    }

    const apiKey = "VVN8MftZuwcuYnDgnlfqceYE6aNkWiun"; // APILayer API 키

    try {
        const spellHeaders = new Headers();
        spellHeaders.append("apikey", apiKey);

        const spellRequestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: spellHeaders
        };

        const spellResponse = await fetch(`https://api.apilayer.com/spell/spellchecker?q=${encodeURIComponent(text)}`, spellRequestOptions);
        const spellResult = await spellResponse.json();
        console.log("Spell Checker API 응답:", spellResult);

        const corrections = spellResult.corrections?.[0];
        const originalText = spellResult.original_text;
        const bestCandidate = corrections?.best_candidate || originalText;
        const candidates = corrections?.candidates?.join(", ") || "대안 없음";

        const spellCheckResult = corrections
            ? `추천 교정: ${bestCandidate} (대안: ${candidates})`
            : "맞춤법 검사 결과 없음";

        const emotionHeaders = new Headers();
        emotionHeaders.append("apikey", apiKey);

        const emotionRequestOptions = {
            method: 'POST',
            redirect: 'follow',
            headers: emotionHeaders,
            body: encodeURIComponent(text)
        };

        const emotionResponse = await fetch("https://api.apilayer.com/text_to_emotion", emotionRequestOptions);
        const emotionResult = await emotionResponse.json();
        console.log("Text to Emotion API 응답:", emotionResult);

        const emotions = Object.entries(emotionResult)
            .map(([emotion, value]) => `${emotion}: ${(value * 100).toFixed(1)}%`)
            .join(", ");

        document.getElementById("result").innerHTML = `
            <strong>맞춤법 검사:</strong> ${spellCheckResult} <br>
            <strong>감정 분석:</strong> ${emotions} <br>
        `;
    } catch (error) {
        console.error("분석 API 요청 실패:", error);
        alert(`분석 API 요청 실패: ${error.message}`);
    }
});

document.getElementById("translateBtn").addEventListener("click", async () => {
    const text = document.getElementById("inputText").value;

    document.getElementById("result").innerHTML = "";

    if (!text) {
        alert("문장을 입력해주세요.");
        return;
    }

    const apiKey = "VVN8MftZuwcuYnDgnlfqceYE6aNkWiun"; // APILayer API 키

    try {
        const translationHeaders = new Headers();
        translationHeaders.append("apikey", apiKey);

        const translationRequestOptions = {
            method: 'POST',
            redirect: 'follow',
            headers: translationHeaders,
            body: text
        };

        const translationResponse = await fetch(
            "https://api.apilayer.com/language_translation/translate?source=korean&target=english",
            translationRequestOptions
        );

        const translationResult = await translationResponse.json();
        console.log("Translation API 응답:", translationResult);

        const translatedText = translationResult.translations?.[0]?.translation || "번역 결과 없음";

        document.getElementById("translationResult").innerHTML = `
            <strong>번역 결과:</strong> ${translatedText} <br>
        `;
    } catch (error) {
        console.error("번역 API 요청 실패:", error);
        alert(`번역 API 요청 실패: ${error.message}`);
    }
});
