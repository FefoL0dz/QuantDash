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
        background: 'var(--bg-color-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'grab',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <span style={{ fontWeight: 500, color: 'var(--text-color-primary)' }}>{title}</span>
            <span style={{ color: 'var(--text-color-secondary)', fontSize: '20px' }}>≡</span>
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
                <div style={{ /* Removed container styling as it is now handled by parent in Dashboard.jsx */ }}>
                    {/* 
                        We removed the container styling because in Dashboard.jsx we wrapped this in a styled div.
                        However, if we want to keep it self-contained properly, we should use variables.
                        But since Dashboard.jsx already provides the "Widget Order" box, we might just want to render the list.
                        Let's keep it simple and just render the items, assuming parent handles container bg.
                        OR, strictly follow instructions to just fix colors.
                        Let's use variables for items.
                     */}
                    {items.map((id) => (
                        <SortableItem key={id} id={id} title={id} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default LayoutEditor;
