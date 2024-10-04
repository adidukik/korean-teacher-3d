import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough } from 'stream';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const speechKey = process.env['SPEECH_KEY'];
  const speechRegion = process.env['SPEECH_REGION'];

  if (!speechKey || !speechRegion) {
    return new Response('Speech service configuration is missing.', {
      status: 500,
    });
  }

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey,
    speechRegion
  );

  // https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts
  const teacher = req.nextUrl.searchParams.get('teacher') || 'SunHi';
  speechConfig.speechSynthesisVoiceName = `ko-KR-${teacher}Neural`;

  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
  const visemes: any[] = [];
  speechSynthesizer.visemeReceived = function (s, e) {
    // console.log(
    //   "(Viseme), Audio offset: " +
    //     e.audioOffset / 10000 +
    //     "ms. Viseme ID: " +
    //     e.visemeId
    // );
    visemes.push([e.audioOffset / 10000, e.visemeId]);
  };
  const audioStream = await new Promise((resolve, reject) => {
    speechSynthesizer.speakTextAsync(
      req.nextUrl.searchParams.get('text') ||
        "I'm excited to try text to speech",
      (result) => {
        const { audioData } = result;

        speechSynthesizer.close();

        // convert arrayBuffer to stream
        const bufferStream = new PassThrough();
        bufferStream.end(Buffer.from(audioData));
        resolve(bufferStream);
      },
      (error) => {
        console.log(error);
        speechSynthesizer.close();
        reject(error);
      }
    );
  });
  //@ts-ignore
  const response = new Response(audioStream, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `inline; filename=tts.mp3`,
      Visemes: JSON.stringify(visemes),
    },
  });
  // audioStream.pipe(response);
  return response;
}
