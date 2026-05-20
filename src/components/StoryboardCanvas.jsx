import React, { forwardRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import Panel from './Panel.jsx';

/**
 * Drag & drop horizontal canvas of storyboard panels.
 * Forwarded ref points to the inner div used for PNG snapshot export.
 */
const StoryboardCanvas = forwardRef(function StoryboardCanvas(
  { panels, setPanels, style, resolution },
  ref
) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = panels.findIndex(p => p.id === active.id);
    const newIndex = panels.findIndex(p => p.id === over.id);
    setPanels(arrayMove(panels, oldIndex, newIndex).map((p, i) => ({ ...p, order: i })));
  }

  function updatePanel(id, partial) {
    setPanels(panels.map(p => (p.id === id ? { ...p, ...partial } : p)));
  }

  // Pilih kolom grid berdasarkan jumlah panel
  const colClass =
    panels.length <= 3
      ? 'grid-cols-1 md:grid-cols-3'
      : panels.length === 4
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={panels.map(p => p.id)} strategy={horizontalListSortingStrategy}>
        <div
          ref={ref}
          className={`grid ${colClass} gap-4 p-4 bg-ink rounded-2xl`}
        >
          {panels.map((panel, idx) => (
            <Panel
              key={panel.id}
              panel={panel}
              onUpdate={updatePanel}
              style={style}
              resolution={resolution}
              sceneNumber={idx + 1}
              totalScenes={panels.length}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
});

export default StoryboardCanvas;
