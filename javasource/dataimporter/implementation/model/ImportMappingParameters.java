package dataimporter.implementation.model;

import com.mendix.integration.ActionWhenNoObjectFound;
import com.mendix.integration.ShouldCommit;
import com.mendix.systemwideinterfaces.core.IMendixObject;

public class ImportMappingParameters {

    private final String importMappingName;
    private final ActionWhenNoObjectFound actionWhenNoObjectFound;
    private final int limit;
    private final ShouldCommit shouldCommit;
    private final String sheetName;
    private final IMendixObject mappingParameter;

    public ImportMappingParameters(
            String importMappingName,
            ActionWhenNoObjectFound actionWhenNoObjectFound,
            int limit,
            ShouldCommit shouldCommit,
            String sheetName, IMendixObject mappingParameter) {

        this.importMappingName = importMappingName;
        this.actionWhenNoObjectFound = actionWhenNoObjectFound;
        this.limit = limit;
        this.shouldCommit = shouldCommit;
        this.sheetName = sheetName;
        this.mappingParameter = mappingParameter;
    }

    public String getImportMappingName() {
        return importMappingName;
    }

    public ActionWhenNoObjectFound getActionWhenNoObjectFound() {
        return actionWhenNoObjectFound;
    }

    public int getLimit() {
        return limit;
    }

    public ShouldCommit getShouldCommit() {
        return shouldCommit;
    }

    public String getSheetName() {
        return sheetName;
    }

    public IMendixObject getMappingParameter() {
        return mappingParameter;
    }

    @Override
    public String toString() {
        return "ImportMappingParameters{" +
                ", importMappingName= '" + importMappingName + '\'' +
                ", actionWhenNoObjectFound= " + actionWhenNoObjectFound +
                ", limit= " + limit +
                ", shouldCommit= " + shouldCommit +
                ", sheetName= " + sheetName +
                ", mappingParameter= " + mappingParameter +
                '}';
    }
}
