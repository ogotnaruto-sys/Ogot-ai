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

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={panels.map(p => p.id)} strategy={horizontalListSortingStrategy}>
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-ink rounded-2xl"
        >
          {panels.map(panel => (
            <Panel
              key={panel.id}
              panel={panel}
              onUpdate={updatePanel}
              style={style}
              resolution={resolution}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
});

export default StoryboardCanvas;
