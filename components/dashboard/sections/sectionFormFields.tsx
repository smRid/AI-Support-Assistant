import React from 'react'

interface SectionFormFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  selectedSources: string[];
  setSelectedSources: (sources: string[]) => void;
  knowledgeSources: KnowledgeSource[];
  isLoadingSources: boolean;
  isDisabled: boolean;
}

const SectionFormFields = ({ formData, 
    setFormData,
    selectedSources,
    setSelectedSources,
    knowledgeSources,
    isLoadingSources,
    isDisabled,}:SectionFormFieldsProps ) => {
    return (
        <div>sectionFormFields</div>
    )
}

const SectionFormFields = () => {
  return (
    <div>SectionFormFields</div>
  )
}

export default SectionFormFields