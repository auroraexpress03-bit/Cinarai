'use client';

import { useIdentificationContext } from '../context/IdentificationContext';
import CandiImage from '../CandiImage';
import ImageOverlay from '../ImageOverlay';
import HighlightOverlay from '../HighlightOverlay';
import FeedbackPanel from '../FeedbackPanel';
import SummaryPanel from '../SummaryPanel';
import ShapeGrid from './ShapeGrid';
import CheckAnswerButton from './CheckAnswerButton';

const OPTIONS = ['Kubus', 'Balok', 'Prisma', 'Limas', 'Kerucut'];

export default function IdentificationStage() {
  const { state, selectShape, checkAnswers, advance, lokasi, cover } = useIdentificationContext();

  // sample highlight mapping for Candi Jawi — positions are example percentages
    type Highlight = {
    id: string;
    left: string;
    top: string;
    width: string;
    height: string;
  };

  const highlightMap: Record<string, Highlight> = {
    Balok: { id: 'balok', left: '10%', top: '50%', width: '80%', height: '30%' },
    Limas: { id: 'limas', left: '35%', top: '10%', width: '30%', height: '20%' },
    Prisma: { id: 'prisma', left: '60%', top: '40%', width: '20%', height: '15%' },
  };

  const highlights = state.highlightShapes
    .map((s: string) => highlightMap[s])
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">
      <div className="text-base font-bold text-neutral-700">🔍 Identifikasi di <span className="text-primary-600">{lokasi}</span></div>

      <CandiImage src={cover || '/comics/komik-1/cover.png'}>
        <ImageOverlay>
          <HighlightOverlay highlights={highlights} />
        </ImageOverlay>
      </CandiImage>

      <p className="text-sm text-neutral-600">Apa saja bangun ruang yang kamu temukan pada Candi Jawi?</p>

      <ShapeGrid options={OPTIONS} selected={state.selectedShapes} onToggle={selectShape} />

      <div className="flex items-center gap-3">
        <CheckAnswerButton onCheck={checkAnswers} disabled={state.selectedShapes.length === 0} />
        <div className="text-sm text-neutral-500">Pilih lebih dari satu jika perlu.</div>
      </div>

      <FeedbackPanel feedback={state.feedback} />

      {Object.keys(state.feedback).length > 0 ? (
        <SummaryPanel selected={state.selectedShapes} correct={state.correctShapes} />
      ) : null}

      <div className="mt-4">
        <button
          type="button"
          onClick={state.completed ? advance : undefined}
          disabled={!state.completed}
          className={`w-full px-4 py-2 rounded-md font-semibold transition duration-150 ${
            state.completed
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
          }`}
        >
          Lanjut ke Tahap Berikutnya
        </button>
      </div>
    </div>
  );
}
