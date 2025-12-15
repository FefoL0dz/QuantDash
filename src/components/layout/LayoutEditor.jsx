import React from 'react';
import { DndContext, closestCenter, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 1. The Individual Draggable Row
const SortableItem = ({ id, title }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '12px 16px',
        marginBottom: '8px',
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'grab',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <span style={{ fontWeight: 500, color: '#374151' }}>{title}</span>
            <span style={{ color: '#9ca3af', fontSize: '20px' }}>≡</span>
        </div>
    );
};

// 2. The Editor Container
const LayoutEditor = ({ items, onReorder }) => {
    // Sensors for better drag handling (prevents accidental drags on buttons if we had them)
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            onReorder(arrayMove(items, oldIndex, newIndex));
        }
    };

    // Convert array of IDs to titles? The parent passes ID list.

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>
                        Widget Order
                    </h4>
                    {items.map((id) => (
                        <SortableItem key={id} id={id} title={id} />
                        // Ideally we'd lookup title from Registry here, but to avoid circular deps or prop drilling, 
                        // we'll just display ID or ask parent to pass objects.
                        // For POC, ID is readable enough ('sentiment_gauge').
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default LayoutEditor;
